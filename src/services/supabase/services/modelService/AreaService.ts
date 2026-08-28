import { supabaseModels } from "@shared/supabase";
import { Area, AreaCreate, AreaUpdate } from "../../types/models/Area";

export const tableName = "areas";

export async function createArea(schema: AreaCreate): Promise<Area>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateArea(
    area: Area["area"], 
    schema: AreaUpdate, 
): Promise<Area>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("area", area)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteArea(area: Area["area"]): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("area", area)
        .throwOnError();

    return true;
}