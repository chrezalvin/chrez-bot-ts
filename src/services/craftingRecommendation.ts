import { ServiceFileSupabase } from "@library";
import { CraftingRecommendation, isCraftingRecommendation } from "@models/craftingRecommendation";
import { supabase } from "@shared/supabase";

export default class CraftingRecommendationService{
    protected static readonly levellingRecommendationPath = "crafting_recommendations";

    static craftingSupabase = new ServiceFileSupabase<CraftingRecommendation, "crafting_id">(
        supabase,
        "crafting_id",
        {
            tableName: "crafting_recommendations",
            typeGuard: isCraftingRecommendation,
            useCache: true,
        }
    )

    static async getCraftingRecommendations(profiency: number, difficulty?: number): Promise<CraftingRecommendation[]>{
        const res = await CraftingRecommendationService
            .craftingSupabase
            .queryBuilder((query) => {
                query.gte("item_level", profiency)

                if(difficulty !== undefined)
                    query.lte("difficulty", difficulty)

                query.limit(4);

                query.order("cost_rating", { ascending: true });

                return query;
            })

        if(!Array.isArray(res))
            throw new Error("Failed to get crafting recommendations");

        return res;
    }
}