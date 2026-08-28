import { ErrorValidation } from "@library";
import { getDiscordYtPlayer } from "@shared/DiscordYtPlayer";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const pauseSchema = z.object({
    voiceChannel: z.custom<VoiceBasedChannel>(),
});

export type I_Pause = z.infer<typeof pauseSchema>;

export async function pause(args: I_Pause): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const discordYtPlayer = getDiscordYtPlayer(args.voiceChannel.guild.id);

    if(!discordYtPlayer)
        throw new ErrorValidation("something_not_found", "discord yt player");

    const result = discordYtPlayer.pause();

    if(result)
        return {content: "Paused the song"};
    else
        return {content: "There are no songs to pause!"};
}