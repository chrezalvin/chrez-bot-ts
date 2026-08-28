import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const resumeSchema = z.object({
    voiceChannel: z.custom<VoiceBasedChannel>(),
});

export type I_Resume = z.infer<typeof resumeSchema>;

export async function resume(args: I_Resume): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const result = discordYtPlayer.resume();

    if(result)
        return {content: "resumed the song"};
    else
        return {content: "There are no songs to resume!"};
}