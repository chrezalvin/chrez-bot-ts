import { MyEmbedBuilder } from "@library";
import { createDiscordYtPlayerIfNotExist, deleteDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { ChatInputCommandInteraction, InteractionReplyOptions, Message, MessageCreateOptions, VoiceBasedChannel, VoiceChannel } from "discord.js";
import z from "zod";

export const playSchema = z.object({
    query: z.string(),
    voiceChannel: z.custom<VoiceBasedChannel>(),
    requester: z.object({
        name: z.string(),
        iconUrl: z.string()
    }),
    message: z.custom<Message>().or(z.custom<ChatInputCommandInteraction>()),
});

export type I_Play = z.infer<typeof playSchema>;

export async function play(args: I_Play): Promise<MessageCreateOptions & InteractionReplyOptions>{
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
                if(args.message.channel?.isSendable())
                    args.message.channel.send("No users left in the voice channel, stopping the queue");

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

            if(args.message.channel?.isSendable())
                args.message.channel.send({embeds: [embed]});
        },
        onQueueEnd: () => {
            deleteDiscordYtPlayer(args.voiceChannel.guild.id);

            if(args.message.channel?.isSendable())
                args.message.channel.send("Queue has ended");
        },
        onError: (error) => {
            deleteDiscordYtPlayer(args.voiceChannel.guild.id);

            if(args.message.channel?.isSendable())
                args.message.channel.send(`Error: ${error.message}`);
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