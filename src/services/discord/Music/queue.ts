import { MyEmbedBuilder } from "@library";
import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const queueSchema = z.object({
    voiceChannel: z.custom<VoiceBasedChannel>()
});

export type I_Queue = z.infer<typeof queueSchema>;

export async function queue(args: I_Queue): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const queue = discordYtPlayer.queue;

    if(queue.length === 0 )
        return {content: "There are no songs to be played!"};
    else{
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

        return {embeds: [queueEmbed, currentEmbed]};
    }
}