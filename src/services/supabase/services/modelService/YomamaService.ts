import { supabaseModels } from "@shared/supabase";
import { Yomama, YomamaCreate, YomamaUpdate } from "../../types/models/Yomama";

export const tableName = "yomamas";

export async function createYomama(schema: YomamaCreate): Promise<Yomama>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateYomama(
    yomama: Yomama["yomama_id"], 
    schema: YomamaUpdate, 
): Promise<Yomama>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("yomama_id", yomama)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteYomama(
    yomama: Yomama["yomama_id"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("yomama_id", yomama)
        .throwOnError();

    return true;
}