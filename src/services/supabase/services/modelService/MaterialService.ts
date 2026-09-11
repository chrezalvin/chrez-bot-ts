// import { supabaseModels } from "@shared/supabase";
// import { Material, materialCreate, MaterialCreate, materialUpdate, MaterialUpdate } from "@services/supabase/types";

// export const tableName = "materials";

// export async function createMaterial(schema: MaterialCreate): Promise<Material>{
//     const parsed = materialCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateMaterial(
//     material: Material["material"], 
//     schema: MaterialUpdate, 
// ): Promise<Material>{
//     const parsed = materialUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("material", material)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteMaterial(
//     material: Material["material"]
// ): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("material", material)
//         .throwOnError();

//     return true;
// }