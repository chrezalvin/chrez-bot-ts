import { MyEmbedBuilder } from "@library";
import { RegistletOrchestrator } from "@services/supabase/services/orchestrator";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import emojis from "@assets/data/emojis.json";
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
                value: registlet.max_level?.toString() ?? "",
                inline: true,
            },
        ]);

        if(registlet.upgrade_cost && registlet.max_level !== 1)
            embed.addFields([{
                name: "Upgrade Cost",
                value: `${registlet.upgrade_cost} (${registlet.upgrade_cost / 10} if matching)`,
                inline: true
            }]);

        embed.addFields([{
            name: "Available at:",
            value: registlet
                .stoodies
                .map(stoodie => `${emojis["ui_registlet"]} Lv. ${stoodie.level} -> ${stoodie.name}`)
                .join("\n")
        }]);

        if(registlet.icon)
            embed.setThumbnail(registlet.icon.image);

        embeds.push(embed);
    }

    return {embeds, content: `found ${registlets.length} registlet named "${parsed.name}"`};
}