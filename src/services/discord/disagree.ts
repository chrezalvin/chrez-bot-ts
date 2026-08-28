import { MyEmbedBuilder, rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import {disagrees} from "@assets/data/disagrees.json";
import z from "zod";

export const disagreeSchema = z.object({
    description: z.string(),
});

export type I_Disagree = z.infer<typeof disagreeSchema>;

export async function disagree(args: I_Disagree): Promise<MessageCreateOptions & InteractionReplyOptions>{
    if(args?.description){
        const embed = new MyEmbedBuilder({
            title: args.description, 
            description: disagrees[rngInt(0, disagrees.length - 1)]
        })

        return {embeds: [embed]};
    }
    else
        return {content: disagrees[rngInt(0, disagrees.length - 1)]};
}