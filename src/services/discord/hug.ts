import { rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const hugSchema = z.object({
    
});

const hugs = [
    "hugs you, making you warm and tender. Until you reach al dente",
    "hugs you, making you feel like a warm and tender chicken",
    "\*hugs\*",
];

export type I_Hug = z.infer<typeof hugSchema>;

export async function hug(args: I_Hug): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const hug = hugs[rngInt(0, hugs.length - 1)];

    return {content: hug};
}