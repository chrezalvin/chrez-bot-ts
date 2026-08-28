const debug = require("debug")("ChrezBot:trait");

import { MyEmbedBuilder} from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";
import { TraitViewService } from "@services/supabase/services";

export const traitSchema = z.object({
    name: z.string().min(3)
});

export type I_Trait = z.input<typeof traitSchema>;

export async function trait(args: I_Trait): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = traitSchema.parse(args);

    const traits = await TraitViewService.getTraits(parsed.name);

    if(traits.length === 0)
        return {embeds: [MyEmbedBuilder.createError({description: "No trait found"})]};

    const embeds: MyEmbedBuilder[] = [];

    for(const trait of traits){
        const embed = new MyEmbedBuilder();

        embed.setTitle(trait.name);

        embed.setFields([
            {
                name: "Description",
                value: trait.description
            }
        ])

        if (trait.extra)
            embed.setFooter({text: trait.extra});

        embeds.push(embed);
    }

    return {embeds, content: `found ${traits.length} trait named "${args.name}"`};
}