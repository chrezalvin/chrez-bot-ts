import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const skipSchema = z.object({
    voiceChannel: z.custom<VoiceBasedChannel>(),
});

export type I_Skip = z.infer<typeof skipSchema>;

export async function skip(args: I_Skip): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    const result = discordYtPlayer.skip();

    if(result)
        return {content: "Skipped the song"};
    else
        return {content: "There are no songs to skip!"};
}