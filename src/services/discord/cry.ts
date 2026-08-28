import { MyEmbedBuilder, rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";
import cryList from "@assets/messages/active/cry.json";

export const crySchema = z.object({
    
});

export type I_Cry = z.infer<typeof crySchema>;

export async function cry(args: I_Cry): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const cry = cryList[rngInt(0, cryList.length - 1)];

    return {content: cry};
}