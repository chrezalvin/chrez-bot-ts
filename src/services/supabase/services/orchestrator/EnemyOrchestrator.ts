import { Enemy } from "@services/supabase/types";
import { enemySimpleView, EnemySimpleView, enemyView, EnemyView } from "@services/supabase/types/views/enemy";
import { supabaseModels } from "@shared/supabase";

export async function getEnemies(name: string): Promise<EnemySimpleView[]>{
    const res = await supabaseModels
        .from("enemies")
        .select(`
            enemy,
            level,
            difficulty_label,
            variant_label,
            ...enemy_names(enemy_name:name),
            ...enemy_types(enemy_type_icon:icons(*)),
            area:location_areas(
                area,
                name,
                location:locations(*)
            )
        `)
        .ilike("enemy_name", `%${name}%`)
        .limit(21)
        .throwOnError();

    const parsed = enemySimpleView.array().parse(res.data);

    return parsed;
}

export async function getEnemy(enemy: Enemy["enemy"]): Promise<EnemyView>{
    const res = await supabaseModels
        .from("enemies")
        .select(`
            level,
            base_exp,
            hp,
            difficulty_label,
            variant_label,
            ...enemy_names(enemy_name: name),
            ...elements(element: name),
            enemy_boss(
                has_difficulty
            ),

            area:location_areas(
                name,
                location:locations(
                    name,
                    location_type:location_types(
                        name,
                        icon:icons(*)
                    )
                )
            ),
            enemy_type:enemy_types(
                name,
                icon:icons(*)
            ),
            drops:items(
                item,
                name,
                description,
                is_verified,
                icon:icons(*),
                item_equipable(
                    equipment_type:item_equipable_types(
                        name,
                        icon:icons(*)
                    ),
                    label:item_equipable_label_types(
                        name,
                        icon:icons(*)
                    )
                )
            )
        `)
        .eq("enemy", enemy)
        .limit(1)
        .single()
        .throwOnError();

    const parsed = enemyView.parse(res.data);

    return parsed;
}