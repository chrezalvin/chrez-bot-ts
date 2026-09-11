import { MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";
import { FoodBuffViewService } from "@services/supabase/services";

export const foodBuffCodeSchema = z.object({
    stat: z.string().min(2),
});

export type I_FoodBuffCode = z.infer<typeof foodBuffCodeSchema>;

export async function foodBuffCode(args: I_FoodBuffCode): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = foodBuffCodeSchema.parse(args);
    
    const foodBuffCode = await FoodBuffViewService.getToramUserFoodBuff(parsed.stat);

    const embed: MyEmbedBuilder = new MyEmbedBuilder();

    embed.setTitle(`Codes for ${foodBuffCode.name} \`${foodBuffCode.stat.stat_name}\``);
    embed.setDescription(
        foodBuffCode.toram_user_food_buffs
            .map(({toram_user, level}) => `- ${toram_user.land_address} \`(Lv.${level})\` [${toram_user.discord_user ? `**${toram_user.toram_user}**` : toram_user.toram_user}]`)
            .join("\n")
    )

    if(foodBuffCode.image)
        embed.setThumbnail(foodBuffCode.image);

    embed.setFooter({
        text: `alternative name for this buff: ${foodBuffCode.aliases.join(", ")}`
    })

    return {embeds: [embed]};
}