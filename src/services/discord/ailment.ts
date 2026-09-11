import { MyEmbedBuilder } from "@library";
import { AilmentOrchestrator } from "@services/supabase/services/orchestrator";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const ailmentSchema = z.object({
    name: z.string().min(3),
});

export type I_Ailment = z.infer<typeof ailmentSchema>;

export async function ailment(args: I_Ailment): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = ailmentSchema.parse(args);

    const ailments = await AilmentOrchestrator.getAilment(parsed.name);

    if(ailments.length === 0)
        return {content: "no ailment found!"};

    const embeds: MyEmbedBuilder[] = [];

    for(const ailment of ailments){
        const embed = new MyEmbedBuilder();

        embed.setTitle(ailment.name);

        if(ailment.icon)
            embed.setThumbnail(ailment.icon.image);

        for(const effect of ailment.ailment_effects)
            embed.addFields([
                {
                    name: effect.affectee.description,
                    value: effect.description.join("\n")
                }
            ])

        embeds.push(embed);
    }

    embeds[embeds.length - 1].setFooter({
        text: "ailment infos are collected from Phantom's Library"
    });

    return {
        embeds, 
        content: `found ${ailments.length} ailment named "${parsed.name}"`,
    };
}