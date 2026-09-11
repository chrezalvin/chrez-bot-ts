import { supabaseModels } from "@shared/supabase";
import { Yomama, yomamaCreate, YomamaCreate, yomamaUpdate, YomamaUpdate } from "@services/supabase/types";

export const tableName = "yomamas";

export async function createYomama(schema: YomamaCreate): Promise<Yomama>{
    const parsed = yomamaCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateYomama(
    yomama: Yomama["yomama_id"], 
    schema: YomamaUpdate, 
): Promise<Yomama>{
    const parsed = yomamaUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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