import { MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";
import { UserPreferedFoodBuffOrchestrator } from "@services/supabase/services/orchestrator";

export const myFoodBuffCodeSchema = z.object({
    user_id: z.string()
});

export type I_MyFoodBuffCode = z.infer<typeof myFoodBuffCodeSchema>;

export async function myFoodBuffCode(args: I_MyFoodBuffCode): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = myFoodBuffCodeSchema.parse(args);
 
    const preferredFoodBuffs = await UserPreferedFoodBuffOrchestrator.getUserPreferedFoodBuff(parsed.user_id);
    
    if(preferredFoodBuffs.length === 0)
        return {embeds: [MyEmbedBuilder.createError({description: "You don't have any preferred food buffs set."})]};

    const embed = new MyEmbedBuilder()

    embed.setTitle(`Your Preferred Food Buffs`);
    for(const preferredFoodBuff of preferredFoodBuffs){
        embed.addFields({
            name: preferredFoodBuff.food_buff.stat.stat_name,
            value: preferredFoodBuff.food_buff.toram_user_food_buffs
                .map(({toram_user, level}) => `- ${toram_user.land_address} \`(Lv.${level})\` [${toram_user.discord_user ? `**${toram_user.toram_user}**` : toram_user.toram_user}]`)
                .join("\n")
        })
    }

    return {embeds: [embed]}
}