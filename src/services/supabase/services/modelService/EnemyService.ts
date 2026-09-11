// import { supabaseModels } from "@shared/supabase";
// import { Enemy, enemyCreate, EnemyCreate, enemyUpdate, EnemyUpdate } from "@services/supabase/types";

// export const tableName = "enemies";

// export async function createEnemy(schema: EnemyCreate): Promise<Enemy>{
//     const parsed = enemyCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateEnemy(
//     enemy: Enemy["enemy"], 
//     schema: EnemyUpdate, 
// ): Promise<Enemy>{
//     const parsed = enemyUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("enemy", enemy)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteEnemy(enemy: Enemy["enemy"]): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("enemy", enemy)
//         .throwOnError();

//     return true;
// }