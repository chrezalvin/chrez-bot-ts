import { CommandBuilder, MyEmbedBuilder } from "@library";
import { CacheType, ChatInputCommandInteraction, GuildMember, InteractionReplyOptions, Message, MessageCreateOptions, MessagePayload, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { createDiscordYtPlayerIfNotExist, deleteDiscordYtPlayer} from "@shared/DiscordYtPlayer";
import { BOT_PREFIXES } from "@config";

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Searches for a song then plays it on voice channel")
    .addStringOption((input) => input
        .setName("search")
        .setDescription("the search term")
        .setRequired(true)
    );

interface PlayParameter {
    query: string;
    voiceChannel: VoiceBasedChannel;
    requester: {
        name: string;
        iconUrl: string;
    }
}

async function run(
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>, 
        args?: PlayParameter
    ): Promise<MessagePayload | (InteractionReplyOptions & MessageCreateOptions)>{
    
    if(!args)
        return {content: "You need to provide a search query"};

    const discordYtPlayer = createDiscordYtPlayerIfNotExist(args.voiceChannel.guild.id);

    await discordYtPlayer.play(args.query, args.voiceChannel, {
        requester: {
            name: args.requester.name,
            iconUrl: args.requester.iconUrl,
        },
        onSongEnd: async () => {
            // check if there are still users in the voice channel
            const voiceChannel = await args.voiceChannel.fetch();
            if(voiceChannel.members.size <= 1){
                if(message.channel?.isSendable())
                    message.channel.send("No users left in the voice channel, stopping the queue");

                discordYtPlayer.stop();
                deleteDiscordYtPlayer(args.voiceChannel.guild.id);
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
            deleteDiscordYtPlayer(args.voiceChannel.guild.id);

            if(message.channel?.isSendable())
                message.channel.send("Queue has ended");
        },
        onError: (error) => {
            deleteDiscordYtPlayer(args.voiceChannel.guild.id);

            if(message.channel?.isSendable())
                message.channel.send(`Error: ${error.message}`);
        }
    });

    const queue = discordYtPlayer.queue;
    const embed = new MyEmbedBuilder();
    const queueToSend = queue.length === 1 ? queue[0] : queue[queue.length - 1];

    if(queue.length === 1)
        embed.setTitle(`Now playing: ${queueToSend.title} by ${queueToSend.author}`);
    else
        embed.setTitle(`Queued: ${queueToSend.title} by ${queueToSend.author}`);

    if(queueToSend.thumbnailUrl)
        embed.setThumbnail(queueToSend.thumbnailUrl);

    if(queueToSend.requester)
        embed.setAuthor({
            name: `requested by: ${queueToSend.requester.name}`,
            iconURL: queueToSend.requester.iconUrl,
        })

    embed.addFields({
        name: "Duration",
        value: queueToSend.duration,
        inline: true
    });

    embed.addFields({
        name: "Volume",
        value: (discordYtPlayer.volume * 100).toFixed(0) + "%",
        inline: true
    });

    return {embeds: [embed]};
}

const play = new CommandBuilder<PlayParameter>()
    .setName("play")
    .setAlias(["p", "pl", "vc"])
    .setDescription("Searches for a song then plays it on voice channel")
    .setStatus("public")
    .setMode("available")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} play bohemian raphsody`, description: "plays bohemian raphsody"},
    ])
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            const query = interaction.options.getString("search", true);

            const voiceChannel = (interaction.member as GuildMember).voice.channel;
            const avatarUrl = interaction.user.displayAvatarURL();
            const name = interaction.user.username;

            if(!voiceChannel)
                throw new Error("You need to be in a voice channel to play music");

            return { query, voiceChannel, requester: { name, iconUrl: avatarUrl } };
        },
        interact: async (interaction, args) => {
            const res = await run(interaction, args);
            
            await interaction.reply(res);
        },
    })
    .setChat({
        getParameter: (message, args) => {
            const query = args.join(" ");

            if(!message.member?.voice.channel)
                throw new Error("You need to be in a voice channel to play music");

            const avatarUrl = message.author.displayAvatarURL();
            const name = message.author.username;

            return { query, voiceChannel: message.member.voice.channel, requester: { name, iconUrl: avatarUrl } };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("You need to provide a search query");

            const res = await run(message, args);

            await message.channel.send(res);
        },
    });

export default play;