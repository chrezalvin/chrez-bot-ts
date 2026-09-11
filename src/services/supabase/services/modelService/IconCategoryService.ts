import { supabaseModels } from "@shared/supabase";
import { IconCategory, iconCategoryCreate, IconCategoryCreate, iconCategoryUpdate, IconCategoryUpdate } from "@services/supabase/types";

export const tableName = "icon_categories";

export async function createIconCategory(schema: IconCategoryCreate): Promise<IconCategory>{
    const parsed = iconCategoryCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateIconCategory(
    iconCategory: IconCategory["icon_category"], 
    schema: IconCategoryUpdate, 
): Promise<IconCategory>{
    const parsed = iconCategoryUpdate.parse(schema);
    
    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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