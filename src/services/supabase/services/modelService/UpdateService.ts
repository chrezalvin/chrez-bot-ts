import { supabaseModels } from "@shared/supabase";
import { Update, updateCreate, UpdateCreate, UpdateUpdate, updateUpdate as updateUpdateTable } from "@services/supabase/types";

export const tableName = "updates";

export async function createUpdate(schema: UpdateCreate): Promise<Update>{
    const parsed = updateCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateUpdate(
    version: Update["version"], 
    schema: UpdateUpdate, 
): Promise<Update>{
    const parsed = updateUpdateTable.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
        .eq("version", version)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteUpdate(
    version: Update["version"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("version", version)
        .throwOnError();

    return true;
}