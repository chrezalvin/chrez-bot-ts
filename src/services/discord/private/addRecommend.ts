import { MyEmbedBuilder } from "@library";
import { RecommendService } from "@services/supabase/services";
import { recommendCreate } from "@services/supabase/types/models/Recommend";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const addRecommendSchema = recommendCreate.extend({

});

export type I_AddRecommend = z.infer<typeof addRecommendSchema>;

export async function addRecommend(args: I_AddRecommend): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = addRecommendSchema.parse(args);

    const recommend = await RecommendService.createRecommend(parsed);
        
    const embed = new MyEmbedBuilder();

    embed
        .setTitle(recommend.title)
        .setDescription(recommend.description);

    if(recommend.imgUrl)
        embed.setThumbnail(recommend.imgUrl);

    if(recommend.link)
        embed.setURL(recommend.link);

    return {embeds: [embed]};
}