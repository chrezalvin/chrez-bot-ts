import { supabaseModels } from "@shared/supabase";
import { Timezone, TimezoneCreate, TimezoneUpdate } from "../../types/models/Timezone";

export const tableName = "timezones";

export async function createTimezone(schema: TimezoneCreate): Promise<Timezone>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateTimezone(
    timezone: Timezone["timezone"], 
    schema: TimezoneUpdate, 
): Promise<Timezone>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("timezone", timezone)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteTimezone(
    timezone: Timezone["timezone"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("timezone", timezone)
        .throwOnError();

    return true;
}