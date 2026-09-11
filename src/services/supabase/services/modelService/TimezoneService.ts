import { supabaseModels } from "@shared/supabase";
import { Timezone, timezoneCreate, TimezoneCreate, timezoneUpdate, TimezoneUpdate } from "@services/supabase/types";

export const tableName = "timezones";

export async function createTimezone(schema: TimezoneCreate): Promise<Timezone>{
    const parsed = timezoneCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateTimezone(
    timezone: Timezone["timezone"], 
    schema: TimezoneUpdate, 
): Promise<Timezone>{
    const parsed = timezoneUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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