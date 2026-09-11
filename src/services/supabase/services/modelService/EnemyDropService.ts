// import { supabaseModels } from "@shared/supabase";
// import { EnemyDrop, enemyDropCreate } from "@services/supabase/types";

// // TODO: improve this service
// export const tableName = "enemy_drops";

// export async function createEnemyDrop(schema: EnemyDrop): Promise<EnemyDrop>{
//     const parsed = enemyDropCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function createEnemyDrops(schema: EnemyDrop[]): Promise<EnemyDrop[]>{
//     const parsed = enemyDropCreate.array().parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .throwOnError();

//     return data!;
// }

// export async function deleteEnemyDrop(enemyDrop: EnemyDrop): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("enemy", enemyDrop.enemy)
//         .eq("material", enemyDrop.material)
//         .throwOnError();

//     return true;
// }