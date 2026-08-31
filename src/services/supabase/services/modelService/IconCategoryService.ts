import { supabaseModels } from "@shared/supabase";
import { IconCategory, IconCategoryCreate, IconCategoryUpdate } from "../../types/models/IconCategory";

export const tableName = "icon_categories";

export async function createIconCategory(schema: IconCategoryCreate): Promise<IconCategory>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateIconCategory(
    iconCategory: IconCategory["icon_category"], 
    schema: IconCategoryUpdate, 
): Promise<IconCategory>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("icon_category", iconCategory)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteIconCategory(
    iconCategory: IconCategory["icon_category"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("icon_category", iconCategory)
        .throwOnError();

    return true;
}