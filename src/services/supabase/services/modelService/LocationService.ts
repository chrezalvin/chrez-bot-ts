// import { supabaseModels } from "@shared/supabase";
// import { Location, locationCreate, LocationCreate, locationUpdate, LocationUpdate } from "@services/supabase/types";

// export const tableName = "locations";

// export async function createLocation(schema: LocationCreate): Promise<Location>{
//     const parsed = locationCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateLocation(
//     location: Location["location"], 
//     schema: LocationUpdate, 
// ): Promise<Location>{
//     const parsed = locationUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("location", location)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteLocation(
//     location: Location["location"]
// ): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("location", location)
//         .throwOnError();

//     return true;
// }