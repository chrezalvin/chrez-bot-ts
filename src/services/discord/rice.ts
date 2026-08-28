import { rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

const riceList = [
    "I like rice",
    "Rice is good",
    "Rice is nice",
    "Rice is life",
    "Rice is love",
    "Rice is everything",
]

export const riceSchema = z.object({
    
});

export type I_Rice = z.infer<typeof riceSchema>;

export async function rice(args: I_Rice): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const rice = riceList[rngInt(0, riceList.length - 1)];

    return {content: rice};
}