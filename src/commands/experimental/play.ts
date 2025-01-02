import { CommandBuilder, MyEmbedBuilder } from "@library";
import { CacheType, ChatInputCommandInteraction, GuildMember, InteractionReplyOptions, Message, MessageCreateOptions, MessagePayload, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { discordYtPlayer } from "@shared";
import { prefixes } from "@config";

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
    requesterAvatarUrl?: string;
}

async function run(
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>, 
        args?: PlayParameter
    ): Promise<MessagePayload | (InteractionReplyOptions & MessageCreateOptions)>{
    
    if(!args)
        return {content: "You need to provide a search query"};

    await discordYtPlayer.play(args.query, args.voiceChannel, {
        requesterAvatarUrl: args.requesterAvatarUrl,
        onSongEnd: () => {
            const embed = new MyEmbedBuilder();

            const current = discordYtPlayer.current;

            if(current){
                embed.setTitle(`Playing: ${current.title} by ${current.author}`);
                
                if(current.thumbnailUrl)
                    embed.setThumbnail(current.thumbnailUrl);

                embed.addFields([
                    {name: "Duration", value: current.duration, inline: true},
                    {name: "Volume", value: (discordYtPlayer.volume * 100).toFixed(0) + "%", inline: true}
                ]);
            }

            if(message.channel?.isSendable())
                message.channel.send({embeds: [embed]});
        },
        onQueueEnd: () => {
            if(message.channel?.isSendable())
                message.channel.send("Queue has ended");
        },
        onError: (error) => {
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
        {command: `${prefixes[0]} play bohemian raphsody`, description: "plays bohemian raphsody"},
    ])
    .setSlash({
        slashCommand: slashCommandBuilder,
        getParameter: (interaction) => {
            const query = interaction.options.getString("search", true);

            const voiceChannel = (interaction.member as GuildMember).voice.channel;
            const avatarUrl = interaction.user.displayAvatarURL();

            if(!voiceChannel)
                throw new Error("You need to be in a voice channel to play music");

            return { query, voiceChannel, requesterAvatarUrl: avatarUrl };
        },
        interact: async (interaction, args) => {
            interaction.deferReply();

            const res = await run(interaction, args);
            
            await interaction.editReply(res);
        },
    })
    .setChat({
        getParameter: (message, args) => {
            const query = args.join(" ");

            if(!message.member?.voice.channel)
                throw new Error("You need to be in a voice channel to play music");

            const avatarUrl = message.author.displayAvatarURL();

            return { query, voiceChannel: message.member.voice.channel, requesterAvatarUrl: avatarUrl };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("You need to provide a search query");

            const res = await run(message, { query: args.query, voiceChannel: args.voiceChannel });

            await message.channel.send(res);
        },
    });

export default play;