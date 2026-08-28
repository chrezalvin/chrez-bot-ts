import { supabaseModels } from "@shared/supabase";
import { Stat, StatCreate, StatUpdate } from "../../types/models/Stat";

export const tableName = "stats";

export async function createStat(schema: StatCreate): Promise<Stat>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateStat(
    stat: Stat["stat"], 
    schema: StatUpdate, 
): Promise<Stat>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("stat", stat)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteStat(
    stat: Stat["stat"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("stat", stat)
        .throwOnError();

    return true;
}