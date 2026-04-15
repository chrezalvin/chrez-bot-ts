import { ServiceFileSupabase } from "@library";
import { isLevellingRecommendation, LevellingRecommendation } from "@models/LevellingRecommendation";
import { supabase } from "@shared/supabase";

export default class LevellingRecommendationService{
    protected static readonly levellingRecommendationPath = "levelling_recommendations";
    protected static readonly levellingRecommendationImgPath = "images/levelling";
    protected static readonly levellingRecommendationLevelRange = 8;
    // protected static readonly cacheKey = "levelling_recommendations_cache";
    
    static quoteSupabase = new ServiceFileSupabase<LevellingRecommendation, "mob_id", never, "mob_image">(
        supabase,
        "mob_id", 
        {
            tableName: LevellingRecommendationService.levellingRecommendationPath,
            typeGuard: isLevellingRecommendation,
            useCache: true,
        },
        {
            bucketName: "images",
            fileKey: "mob_image",
            storagePath: "levelling"
        }
    );

    static async getLevellingRecommendations(level: number, events?: number[]): Promise<LevellingRecommendation[]>{
        const minlevel = level - LevellingRecommendationService.levellingRecommendationLevelRange;
        const maxlevel = level + LevellingRecommendationService.levellingRecommendationLevelRange;
        
        const recommendations = await LevellingRecommendationService
            .quoteSupabase
            .queryBuilder((query) => query
                .gte("mob_level", minlevel)
                .lte("mob_level", maxlevel)
                .limit(10)
            )

        if(!Array.isArray(recommendations))
            throw new Error("Failed to get levelling recommendations");

        return recommendations
            .filter((recommendation) => {
                if(recommendation.event)
                    return events?.includes(recommendation.event) ?? false;
                else
                    return true;
            });
    }
}