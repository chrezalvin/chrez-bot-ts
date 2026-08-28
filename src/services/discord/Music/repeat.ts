import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const repeatSchema = z.object({
    voiceChannel: z.custom<VoiceBasedChannel>(),
    repeat: z.boolean(),
});

export type I_Repeat = z.infer<typeof repeatSchema>;

export async function repeat(args: I_Repeat): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new Error("No player found");

    discordYtPlayer.repeat = args.repeat;

    if(args.repeat)
        return {content: "Repeating the playlist"};
    else
        return {content: "Stopped repeating the playlist"};
}