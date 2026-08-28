import { supabaseModels } from "@shared/supabase";
import { Material, MaterialCreate, MaterialUpdate } from "../../types/models/Material";

export const tableName = "materials";

export async function createMaterial(schema: MaterialCreate): Promise<Material>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateMaterial(
    material: Material["material"], 
    schema: MaterialUpdate, 
): Promise<Material>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("material", material)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteMaterial(
    material: Material["material"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("material", material)
        .throwOnError();

    return true;
}