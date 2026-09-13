import { enemySimpleView, EnemySimpleView, enemyView, EnemyView } from "@services/supabase/types/views/enemy";
import { supabaseModels } from "@shared/supabase";

export async function getEnemies(name: string): Promise<EnemySimpleView[]>{
    const res = await supabaseModels
        .from("enemies")
        .select(`
            name,
            enemy_detail:enemy_details(
                level,
                enemy:enemies(*),
                area:location_areas(
                    area,
                    name,
                    location:locations(*)
                ),
                enemy_type:enemy_types(
                    enemy_type,
                    name,
                    icon:icons(*)
                ),
                enemy_difficulty:enemy_difficulties(
                    name
                )
            )
        `)
        .ilike("name", `%${name}%`)
        .limit(21)
        .throwOnError();

    const parsed = enemySimpleView.array().parse(res.data);

    return parsed;
}

export async function getEnemy(
    enemy: string,
    area: string,
    enemy_type: string,
    level: number
): Promise<EnemyView>{
    const res = await supabaseModels
        .from("enemy_details")
        .select(`
            level,
            base_exp,
            hp,
            enemy:enemies(
                *
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
            element:elements(
                element:element_weakness!element_weakness_element_fkey(
                    element:elements!element_weakness_element_fkey(*),
                    weakness:elements!element_weakness_weakness_fkey(*)
                )
            ),
            enemy_difficulty:enemy_difficulties(
                *
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
        .eq("area", area)
        .eq("enemy_type", enemy_type)
        .eq("level", level)
        .limit(1)
        .single()
        .throwOnError();

    const parsed = enemyView.parse(res.data);

    return parsed;
}