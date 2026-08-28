import { supabaseModels } from "@shared/supabase";
import { Location, LocationCreate, LocationUpdate } from "../../types/models/Location";

export const tableName = "locations";

export async function createLocation(schema: LocationCreate): Promise<Location>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateLocation(
    location: Location["location"], 
    schema: LocationUpdate, 
): Promise<Location>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("location", location)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteLocation(
    location: Location["location"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("location", location)
        .throwOnError();

    return true;
}