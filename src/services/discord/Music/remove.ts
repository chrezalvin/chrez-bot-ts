import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const removeSchema = z.object({
    index: z.number(),
    voiceChannel: z.custom<VoiceBasedChannel>(),
});

export type I_Remove = z.infer<typeof removeSchema>;

export async function remove(args: I_Remove): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    if(args.index < 0 || args.index >= discordYtPlayer.queue.length)
        throw new Error("Invalid index");

    const removedSong = discordYtPlayer.removeQueue(args.index);

    if(removedSong)
        return {content: `removed ${removedSong.title} by ${removedSong.author}`};
    else
        return {content: "There are no songs to be played!"};
}