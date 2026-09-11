// import { supabaseModels } from "@shared/supabase";
// import { MaterialType, materialTypeCreate, MaterialTypeCreate, materialTypeUpdate, MaterialTypeUpdate } from "@services/supabase/types";

// export const tableName = "material_types";

// export async function createMaterialType(schema: MaterialTypeCreate): Promise<MaterialType>{
//     const parsed = materialTypeCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateMaterialType(
//     materialType: MaterialType["material_type"], 
//     schema: MaterialTypeUpdate, 
// ): Promise<MaterialType>{
//     const parsed = materialTypeUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("material_type", materialType)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteMaterialType(
//     materialType: MaterialType["material_type"]
// ): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("material_type", materialType)
//         .throwOnError();

//     return true;
// }