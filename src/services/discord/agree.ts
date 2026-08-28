import { MyEmbedBuilder, rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import {agrees} from "@assets/data/agrees.json";
import z from "zod";

export const agreeSchema = z.object({
    description: z.string(),
});

export type I_Agree = z.infer<typeof agreeSchema>;

export async function agree(args: I_Agree): Promise<MessageCreateOptions & InteractionReplyOptions>{
    if(args?.description !== undefined && args?.description !== ""){
        const embed = new MyEmbedBuilder({title: args.description, description: agrees[rngInt(0, agrees.length - 1)]});
        return {embeds: [embed]};
    }
    else
        return {content: agrees[rngInt(0, agrees.length - 1)]};
}