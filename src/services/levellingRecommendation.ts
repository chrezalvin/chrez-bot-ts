import { ServiceFileSupabase } from "@library";
import { isLevellingRecommendation, LevellingRecommendation } from "@models/LevellingRecommendation";
import { supabase } from "@shared/supabase";

export default class LevellingRecommendationService{
    protected static readonly levellingRecommendationPath = "levelling_recommendations";
    
    static quoteSupabase = new ServiceFileSupabase<LevellingRecommendation, "mob_id">(
        supabase,
        "mob_id", {
        tableName: LevellingRecommendationService.levellingRecommendationPath,
        typeGuard: isLevellingRecommendation,
        useCache: true,
    });

    static async getLevellingRecommendations(level: number): Promise<LevellingRecommendation[]>{
        const minlevel = level - 8;
        const maxlevel = level + 8;
        
        const recommendations = await LevellingRecommendationService
            .quoteSupabase
            .queryBuilder((query) => query
                .gte("mob_level", minlevel)
                .lte("mob_level", maxlevel)
                .order("mob_base_exp", { ascending: true })
                .limit(10)
            )

        if(!Array.isArray(recommendations))
            throw new Error("Failed to get levelling recommendations");

        return recommendations;
    }
}