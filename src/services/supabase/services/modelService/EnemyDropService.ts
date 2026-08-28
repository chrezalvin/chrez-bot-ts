import { supabaseModels } from "@shared/supabase";
import { EnemyDrop } from "../../types/models/EnemyDrop";

// TODO: improve this service
export const tableName = "enemy_drops";

export async function createEnemyDrop(schema: EnemyDrop): Promise<EnemyDrop>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function createEnemyDrops(schema: EnemyDrop[]): Promise<EnemyDrop[]>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .throwOnError();

    return data!;
}

export async function deleteEnemyDrop(enemyDrop: EnemyDrop): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("enemy", enemyDrop.enemy)
        .eq("material", enemyDrop.material)
        .throwOnError();

    return true;
}