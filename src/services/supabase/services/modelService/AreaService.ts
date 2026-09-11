// import { supabaseModels } from "@shared/supabase";
// import { Area, areaCreate, AreaCreate, areaUpdate, AreaUpdate } from "@services/supabase/types";

// export const tableName = "areas";

// export async function createArea(schema: AreaCreate): Promise<Area>{
//     const parsed = areaCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateArea(
//     area: Area["area"], 
//     schema: AreaUpdate, 
// ): Promise<Area>{
//     const parsed = areaUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("area", area)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteArea(area: Area["area"]): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("area", area)
//         .throwOnError();

//     return true;
// }