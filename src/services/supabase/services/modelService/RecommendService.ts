import { supabaseModels } from "@shared/supabase";
import { Recommend, RecommendCreate, RecommendUpdate } from "../../types/models/Recommend";

export const tableName = "recommends";

export async function createRecommend(schema: RecommendCreate): Promise<Recommend>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateRecommend(
    recommend: Recommend["recommend_id"], 
    schema: RecommendUpdate, 
): Promise<Recommend>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("recommend_id", recommend)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteRecommend(
    recommend: Recommend["recommend_id"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("recommend_id", recommend)
        .throwOnError();

    return true;
}