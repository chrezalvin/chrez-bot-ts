// import { supabaseModels } from "@shared/supabase";
// import { GearType, gearTypeCreate, GearTypeCreate, gearTypeUpdate, GearTypeUpdate } from "@services/supabase/types";

// export const tableName = "gear_types";

// export async function createGearType(schema: GearTypeCreate): Promise<GearType>{
//     const parsed = gearTypeCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateGearType(
//     gearType: GearType["gear_type"], 
//     schema: GearTypeUpdate, 
// ): Promise<GearType>{
//     const parsed = gearTypeUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("gearType", gearType)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteGearType(
//     gearType: GearType["gear_type"]
// ): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("gearType", gearType)
//         .throwOnError();

//     return true;
// }