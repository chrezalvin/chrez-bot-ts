import { supabaseModels } from "@shared/supabase";
import { Enemy, EnemyCreate, EnemyUpdate } from "../../types/models/Enemy";

export const tableName = "enemies";

export async function createEnemy(schema: EnemyCreate): Promise<Enemy>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateEnemy(
    enemy: Enemy["enemy"], 
    schema: EnemyUpdate, 
): Promise<Enemy>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("enemy", enemy)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteEnemy(enemy: Enemy["enemy"]): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("enemy", enemy)
        .throwOnError();

    return true;
}