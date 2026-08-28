import { supabaseModels } from "@shared/supabase";
import { MaterialType, MaterialTypeCreate, MaterialTypeUpdate } from "../../types/models/MaterialType";

export const tableName = "material_types";

export async function createMaterialType(schema: MaterialTypeCreate): Promise<MaterialType>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateMaterialType(
    materialType: MaterialType["material_type"], 
    schema: MaterialTypeUpdate, 
): Promise<MaterialType>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("material_type", materialType)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteMaterialType(
    materialType: MaterialType["material_type"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("material_type", materialType)
        .throwOnError();

    return true;
}