// import { supabaseModels } from "@shared/supabase";
// import { Stat, statCreate, StatCreate, statUpdate, StatUpdate } from "@services/supabase/types";

// export const tableName = "stats";

// export async function createStat(schema: StatCreate): Promise<Stat>{
//     const parsed = statCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateStat(
//     stat: Stat["stat"], 
//     schema: StatUpdate, 
// ): Promise<Stat>{
//     const parsed = statUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("stat", stat)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteStat(
//     stat: Stat["stat"]
// ): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("stat", stat)
//         .throwOnError();

//     return true;
// }