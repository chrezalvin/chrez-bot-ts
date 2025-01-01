import { CommandBuilder, DiscordYtPlayerItem, MyEmbedBuilder } from "@library";
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
}

function createSongQueueEmbed(queue: DiscordYtPlayerItem[]){
    const myEmbed = new MyEmbedBuilder();

    if(queue.length !== 0){
        myEmbed.setTitle(`Playing: ${queue[0].title} by ${queue[0].author}`);

        if(queue[0].thumbnailUrl)
            myEmbed.setThumbnail(queue[0].thumbnailUrl);
    }

    if(queue.length > 1){
        myEmbed.setDescription(queue.slice(1).map((item, index) => {
            return `#${index + 1} ${item.title} by ${item.author}`;
        }).join("\n"));
    }

    return myEmbed;
}

async function run(message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: PlayParameter): Promise<MessagePayload | (InteractionReplyOptions & MessageCreateOptions)>{
    if(!args)
        return {content: "You need to provide a search query"};

    await discordYtPlayer.play(args.query, args.voiceChannel, {
        onSongEnd: () => {
            const embed = createSongQueueEmbed(discordYtPlayer.queue);

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
    const embed = createSongQueueEmbed(queue);

    if(queue.length === 1){
        const queueToSend = queue[0];

        embed.setTitle(`Now playing: ${queueToSend.title} by ${queueToSend.author}`);

        if(queueToSend.thumbnailUrl)
            embed.setThumbnail(queueToSend.thumbnailUrl);
    }
    else{
        const queueToSend = queue[queue.length - 1];
        embed.setTitle(`Queued: ${queueToSend.title} by ${queueToSend.author}`);

        if(queueToSend.thumbnailUrl)
            embed.setThumbnail(queueToSend.thumbnailUrl);
    }

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

            if(!voiceChannel)
                throw new Error("You need to be in a voice channel to play music");

            return { query, voiceChannel };
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

            return { query, voiceChannel: message.member.voice.channel };
        },
        execute: async (message, args) => {
            if(!args)
                throw new Error("You need to provide a search query");

            const res = await run(message, { query: args.query, voiceChannel: args.voiceChannel });

            await message.channel.send(res);
        },
    });

export default play;