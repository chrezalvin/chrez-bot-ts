import {MyEmbedBuilder, CommandBuilder, ErrorValidation, searchYoutube, YoutubeSearchResultItem} from "@library";

import { CacheType, ChannelType, ChatInputCommandInteraction, GuildMember, Message, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { BOT_PREFIXES } from "@config";
import { createDiscordYtPlayerIfNotExist, deleteDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { PlaylistService } from "@services";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Playlist) => {
    if(!args)
        return {content: "Invalid parameters"};

    if(!message.member?.user.id)
        return new ErrorValidation("something_not_found", "user");

    const userId = message.member.user.id;
    const discordYtPlayer = createDiscordYtPlayerIfNotExist(message.guild?.id ?? "");
    const discordEmbed = new MyEmbedBuilder();

    if(args.options === "save"){
        if(discordYtPlayer.queue.length === 0)
            return new ErrorValidation("something_not_found", "queue");

        if(!args.playlistName)
            return new ErrorValidation("something_not_found", "playlist name");

        const found = await PlaylistService.getPlaylistByNameAndUser(args.playlistName, userId)

        if(found)
            throw new ErrorValidation("duplicate_entry", `Playlist name \`${args.playlistName}\``);

        const playlist = await PlaylistService.setNewPlaylist({
            user: userId,
            name: args.playlistName,
            link_list: discordYtPlayer.queue.map(item => item.videoUrl)
        });

        discordEmbed
            .setTitle(`Playlist ${playlist.name} Saved!`)
            .setDescription(`Successfully saved playlist \`${playlist.name}\` - ${playlist.link_list.length} items`);
    }
    else if(args.options === "remove"){
        if(!args.playlistName)
            return new ErrorValidation("something_not_found", "playlist name");

        const playlist = await PlaylistService.getPlaylistByNameAndUser(args.playlistName, userId);

        if(!playlist)
            return new ErrorValidation("something_not_found", `playlist with name ${args.playlistName}`);

        await PlaylistService.deletePlaylistById(playlist.playlist_id);

        discordEmbed
            .setTitle(`Playlist ${playlist.name} Removed!`)
            .setDescription(`Successfully removed playlist \`${args.playlistName}\``);
    }
    else if(args.options === "view"){
        if(args.playlistName){
            const playlist = await PlaylistService.getPlaylistByNameAndUser(args.playlistName, userId);

            if(!playlist)
                return new ErrorValidation("something_not_found", `playlist with name ${args.playlistName}`);

            const playlistItems: (string | YoutubeSearchResultItem)[] = [];
            
            for(const item of playlist.link_list){
                const found = await searchYoutube(item, 1);
                if(found.items.length === 0)
                    playlistItems.push(item);
                else
                    playlistItems.push(found.items[0]);
            }

            discordEmbed.setDescription(playlistItems.map((item, index) => {
                return `#${index + 1} ${typeof item === "string" ? `[corrupted](${playlist.link_list[index]})` : `[${item.title}](${playlist.link_list[index]}) by ${item.channelTitle}`}`;
            }).join("\n"))
            .setTitle(`Playlist: ${playlist.name} - ${playlist.link_list.length} items`);
        }
        else{
            const playlist = await PlaylistService.getPlaylistByUser(userId);
    
            if(playlist.length === 0)
                return {content: "You have no saved playlist"};
    
            discordEmbed
                .setTitle("Your saved playlist")
                .setDescription(playlist.map(item => `**${item.name}** - ${item.link_list.length} items`).join("\n"));
        }
    }
    else if(args.options === "update"){
        return {content: "updating playlist is not yet implemented"};
    }
    else{
        if(!args.voiceChannel)
            throw new Error("You need to be in a voice channel to play music");

        const vc = args.voiceChannel;

        if(!args.playlistName)
            return new ErrorValidation("something_not_found", "playlist name");

        const playlist = await PlaylistService.getPlaylistByNameAndUser(args.playlistName, userId);

        if(!playlist)
            return new ErrorValidation("something_not_found", `playlist with name ${args.playlistName}`);

        // stop the queue playing if exist
        discordYtPlayer.stop();
        
        let corruptedCount = 0;
        for(const item of playlist.link_list){
            const found = await searchYoutube(item, 1);

            if(found.items.length === 0){
                corruptedCount++;
                continue;
            }

            await discordYtPlayer.play(item, args.voiceChannel, {
                requester: {
                    name: args.requester.name,
                    iconUrl: args.requester.iconUrl,
                },
                onSongEnd: async () => {
                    // check if there are still users in the voice channel
                    const voiceChannel = await vc.fetch();
                    if(voiceChannel.members.size <= 1){
                        if(message.channel?.isSendable())
                            message.channel.send("No users left in the voice channel, stopping the queue");

                        discordYtPlayer.stop();
                        deleteDiscordYtPlayer(vc.guild.id);
                        return;
                    }

                    const embed = new MyEmbedBuilder();

                    const current = discordYtPlayer.current;

                    if(current){
                        embed.setTitle(`Playing: ${current.title} by ${current.author}`);
                        
                        if(current.thumbnailUrl)
                            embed.setThumbnail(current.thumbnailUrl);

                        if(current.requester)
                            embed.setAuthor({
                                name: `requested by: ${current.requester.name}`,
                                iconURL: current.requester.iconUrl,
                            })

                        embed.addFields([
                            {name: "Duration", value: current.duration, inline: true},
                            {name: "Volume", value: (discordYtPlayer.volume * 100).toFixed(0) + "%", inline: true}
                        ]);
                    }

                    if(message.channel?.isSendable())
                        message.channel.send({embeds: [embed]});
                },
                onQueueEnd: () => {
                    deleteDiscordYtPlayer(vc.guild.id);

                    if(message.channel?.isSendable())
                        message.channel.send("Queue has ended");
                },
                onError: (error) => {
                    deleteDiscordYtPlayer(vc.guild.id);

                    if(message.channel?.isSendable())
                        message.channel.send(`Error: ${error.message}`);
                }
            });
        }


        const queue = discordYtPlayer.queue;
        const queueEmbed = new MyEmbedBuilder();

        queueEmbed.setDescription(queue.map((item, index) => {
            if(index === 0)
                return `**[current]** [${item.title}](${item.videoUrl}) by ${item.author} [${item.duration}]`; 
            else
                return `#${index} [${item.title}](${item.videoUrl}) by ${item.author} [${item.duration}]`;
        }).join("\n"));

        const currentEmbed = new MyEmbedBuilder();

        const current = discordYtPlayer.current;

        if(current){
            currentEmbed.setTitle(`Playing: ${current.title} by ${current.author}`);
            
            if(current.thumbnailUrl)
                currentEmbed.setThumbnail(current.thumbnailUrl);

            if(current.requester)
                currentEmbed.setAuthor({
                    name: `requested by: ${current.requester.name}`,
                    iconURL: current.requester.iconUrl,
                })

            const duration = new Date(discordYtPlayer.durationMs ?? 0);
            const s = duration.getUTCSeconds();
            const m = duration.getUTCMinutes();
            const h = duration.getUTCHours();

            // format the duration 00:00:00 -> hh:mm:ss or mm:ss, use trailing zero
            const durationString = `${h ? h + ":" : ""}${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
            
            currentEmbed.addFields([
                {name: "Duration", value: `${durationString}/${current.duration.replaceAll(".", ":")}`, inline: true},
                {name: "Volume", value: (discordYtPlayer.volume * 100).toFixed(0) + "%", inline: true}
            ]);
        }

        return {embeds: [queueEmbed, currentEmbed], content: `successfully loaded playlist \`${playlist.name}\` with ${playlist.link_list.length} items \`(${corruptedCount} corrupted)\``};
    }

    return {embeds: [discordEmbed]};
}

type PlaylistOptions = "view" | "save" | "remove" | "update" | "play";
interface I_Playlist{
    options: PlaylistOptions;
    playlistName?: string;
    voiceChannel: VoiceBasedChannel | null;
    requester: {
        name: string;
        iconUrl: string;
    }
};

const playlist = new CommandBuilder<I_Playlist>()
    .setName("playlist")
    .setDescription("Save or view your playlist")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} playlist / ${BOT_PREFIXES[0]} playlist view`, description: "view your saved playlist"},
        {command: `${BOT_PREFIXES[0]} playlist view <name>`, description: "view your saved playlist with specified name"},
        {command: `${BOT_PREFIXES[0]} playlist play <name>`, description: "play a saved playlist"},
        {command: `${BOT_PREFIXES[0]} playlist remove <name>`, description: "remove a playlist from your saved playlist"},
        {command: `${BOT_PREFIXES[0]} playlist save <name>`, description: "save a playlist to your saved playlist"},
        {command: `${BOT_PREFIXES[0]} playlist update <name>`, description: "updates current queue to a saved playlist"}
    ])
    .setChannelTypes([ChannelType.GuildText])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("playlist")
            .setDescription("Save or view your playlist, you can specify which playlist you want using the option")
            .addStringOption(option => option
                .setName("options")
                .setDescription("Options to manage your playlist")
                .setRequired(true)
                .addChoices([
                    {name: "play", value: "play"},
                    {name: "view", value: "view"},
                    {name: "save", value: "save"},
                    {name: "remove", value: "remove"},
                    {name: "update", value: "update"},
                ])
            )
            .addStringOption(option => option
                .setName("name")
                .setRequired(false)
                .setDescription("Name of the playlist")
            ),
        interact: async (interaction, args) => {
            await interaction.deferReply();
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.followUp(embeds);
        },
        getParameter(interaction) {
            const voiceChannel = (interaction.member as GuildMember).voice.channel;
            const avatarUrl = interaction.user.displayAvatarURL();
            const name = interaction.user.username;

            const options = interaction.options.getString("options", true) as PlaylistOptions;
            const playlistName = interaction.options.getString("name", false) ?? undefined;

            return {
                options, 
                playlistName,
                voiceChannel,
                requester: { 
                    name,
                    iconUrl: avatarUrl 
                }
            };
        }
    });

export default playlist;