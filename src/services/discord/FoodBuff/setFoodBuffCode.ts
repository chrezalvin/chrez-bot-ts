import { MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, MessageMentions } from "discord.js";
import z from "zod";
import { UserPreferedFoodBuffOrchestrator } from "@services/supabase/services/orchestrator";

export const setFoodBuffCodeSchema = z.object({
    user_id: z.string(),
    keywords: z.array(z.string().min(2)).min(2).max(4),
});

export type I_SetFoodBuffCode = z.input<typeof setFoodBuffCodeSchema>;

export async function setFoodBuffCode(args: I_SetFoodBuffCode): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = setFoodBuffCodeSchema.parse(args);
    
    const preferredFoodBuffs = await UserPreferedFoodBuffOrchestrator.setUserPreferedFoodBuff(parsed.user_id, parsed.keywords);

    const embed: MyEmbedBuilder = new MyEmbedBuilder();

    embed.setTitle(`Your preferred food buff has been set!`);
    embed.setDescription(
        preferredFoodBuffs
            .map(foodBuff => `${foodBuff.food_buff.name}: ${foodBuff.food_buff.stat.stat_name}`)
            .map(code => `\n - ${code}`)
            .join("")
    )

    embed.setFooter({
        text: `type "Chrez food me" to view your codes`
    })

    return {embeds: [embed]};
}