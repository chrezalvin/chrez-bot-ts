import { supabaseModels } from "@shared/supabase";
import { GearType, GearTypeCreate, GearTypeUpdate } from "../../types/models/GearType";

export const tableName = "gear_types";

export async function createGearType(schema: GearTypeCreate): Promise<GearType>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateGearType(
    gearType: GearType["gear_type"], 
    schema: GearTypeUpdate, 
): Promise<GearType>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("gearType", gearType)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteGearType(
    gearType: GearType["gear_type"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("gearType", gearType)
        .throwOnError();

    return true;
}