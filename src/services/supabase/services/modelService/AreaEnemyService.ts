// import { supabaseModels } from "@shared/supabase";
// import { AreaEnemy, areaEnemyCreate, AreaEnemyCreate, areaEnemyUpdate, AreaEnemyUpdate } from "@services/supabase/types";

// export const tableName = "area_enemies";

// export async function createAreaEnemy(schema: AreaEnemyCreate): Promise<AreaEnemy>{
//     const parsed = areaEnemyCreate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .insert(parsed)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function updateAreaEnemy(
//     areaEnemy: {
//         area: AreaEnemy["area"],
//         enemy: AreaEnemy["enemy"],
//         level: AreaEnemy["level"]
//     }, 
//     schema: AreaEnemyUpdate, 
// ): Promise<AreaEnemy>{
//     const parsed = areaEnemyUpdate.parse(schema);

//     const {data} = await supabaseModels
//         .from(tableName)
//         .update(parsed)
//         .eq("area", areaEnemy.area)
//         .eq("enemy", areaEnemy.enemy)
//         .eq("level", areaEnemy.level)
//         .select()
//         .single()
//         .throwOnError();

//     return data!;
// }

// export async function deleteAreaEnemy(areaEnemy: AreaEnemy["area"]): Promise<true>{
//     await supabaseModels
//         .from(tableName)
//         .delete()
//         .eq("areaEnemy", areaEnemy)
//         .throwOnError();

//     return true;
// }