import { MyEmbedBuilder, rngInt } from "@library";
import { Attachment, InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const helloSchema = z.object({
    msg: z.string()
});

export type I_Hello = z.infer<typeof helloSchema>;

export async function hello(args: I_Hello): Promise<MessageCreateOptions & InteractionReplyOptions>{
    return {content: args.msg};
}