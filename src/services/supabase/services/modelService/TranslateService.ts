import { supabaseModels } from "@shared/supabase";
import { Translate, translateCreate, TranslateCreate, translateUpdate, TranslateUpdate } from "@services/supabase/types";

export const tableName = "translates";

export async function createTranslate(schema: TranslateCreate): Promise<Translate>{
    const parsed = translateCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateTranslate(
    translate: Translate["translate_id"], 
    schema: TranslateUpdate, 
): Promise<Translate>{
    const parsed = translateUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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