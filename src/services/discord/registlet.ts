import { getEmoji, MyEmbedBuilder } from "@library";
import { RegistletOrchestrator } from "@services/supabase/services/orchestrator";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const registletSchema = z.object({
    name: z.string().min(3),
});

export type I_Registlet = z.infer<typeof registletSchema>;

export async function registlet(args: I_Registlet): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = registletSchema.parse(args);

    const registlets = await RegistletOrchestrator.getRegistlets(parsed.name);

    if(registlets.length === 0)
        return {embeds: [MyEmbedBuilder.createError({description: "No registlet found"})]};

    const embeds: MyEmbedBuilder[] = [];

    for(const registlet of registlets){
        const embed = new MyEmbedBuilder();

        embed.setTitle(registlet.name);

        embed.setDescription(registlet.description);

        embed.setFields([
            {
                name: "Max Level",
                value: registlet.max_level?.toString() ?? ""
            },
            {
                name: "Stoodies",
                value: registlet
                    .stoodies
                    .map(stoodie => `${getEmoji("registlet")} Lv. ${stoodie.level} -> ${stoodie.name}`)
                    .join("\n")
            }
        ]);

        if(registlet.image)
            embed.setThumbnail(registlet.image);

        embeds.push(embed);
    }

    return {embeds, content: `found ${registlets.length} registlet named "${parsed.name}"`};
}