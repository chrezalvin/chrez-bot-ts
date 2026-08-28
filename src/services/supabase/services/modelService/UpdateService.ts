import { supabaseModels } from "@shared/supabase";
import { Update, UpdateCreate, UpdateUpdate } from "../../types/models/Update";

export const tableName = "updates";

export async function createUpdate(schema: UpdateCreate): Promise<Update>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateUpdate(
    version: Update["version"], 
    schema: UpdateUpdate, 
): Promise<Update>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
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