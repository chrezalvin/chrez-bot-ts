import { MyEmbedBuilder, rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import laughs from "@assets/messages/private/laugh.json";
import z from "zod";

export const laughSchema = z.object({
    
});

export type I_Laugh = z.infer<typeof laughSchema>;

export async function laugh(args: I_Laugh): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const laugh = laughs[rngInt(0, laughs.length - 1)];

    const embed = new MyEmbedBuilder({
        title: "Chrezbot is laughing",
        description: laugh
    });

    return {embeds: [embed]};
}