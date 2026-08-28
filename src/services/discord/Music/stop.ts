import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const stopSchema = z.object({
    voiceChannel: z.custom<VoiceBasedChannel>(),
});

export type I_Stop = z.infer<typeof stopSchema>;

export async function stop(args: I_Stop): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const result = discordYtPlayer.stop();

    if(result)
        return {content: "Stopped the songs"};
    else
        return {content: "There are no songs to stop!"};
}