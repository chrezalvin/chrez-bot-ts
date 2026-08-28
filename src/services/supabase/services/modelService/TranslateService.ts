import { supabaseModels } from "@shared/supabase";
import { Translate, TranslateCreate, TranslateUpdate } from "../../types/models/Translate";

export const tableName = "translates";

export async function createTranslate(schema: TranslateCreate): Promise<Translate>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateTranslate(
    translate: Translate["translate_id"], 
    schema: TranslateUpdate, 
): Promise<Translate>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("translate_id", translate)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteTranslate(
    translate: Translate["translate_id"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("translate_id", translate)
        .throwOnError();

    return true;
}