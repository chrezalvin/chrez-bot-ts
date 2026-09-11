import { itemSimpleView, ItemSimpleView } from "@services/supabase/types/views/item";
import { ItemView, itemView } from "@services/supabase/types/views/item/ItemView";
import { supabaseModels } from "@shared/supabase";

export async function getItems(item: string): Promise<ItemSimpleView[]>{
    const res = await supabaseModels
        .from("items")
        .select(`
            *,
            item_crysta:item_crystas(
                crysta_type:item_crysta_types(
                    icon:item_crysta_types_icon_fkey(*)
                )
            ),
            item_processable(
                material:item_material_types(
                    icon:icon(*)
                )
            ),
            item_equipable(
                equipment_type:item_equipable_types(
                    name,
                    icon:icons(*)
                ),
                label:item_equipable_label_types(
                    name,
                    icon:icons(*)
                )
            ),
            item_chests!item(*)
        `)
        .ilike("name", `%${item}%`)
        .limit(7)
        .throwOnError();

    const parsed = itemSimpleView.array().parse(res.data);

    return parsed;
}

export async function getItem(item: string): Promise<ItemView>{
    const res = await supabaseModels
        .from("items")
        .select(`
            *,
            item_crysta:item_crystas(
                crysta_type:item_crysta_types(
                    name,
                    icon:icons!item_crysta_types_icon_fkey(*),
                    icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                ),
                upgrades_from_for:item_crysta_upgrades!item_crysta_upgrades_upgrade_for_fkey(
                    base_crysta:item_crystas!item_crysta_upgrades_base_crysta_fkey(
                        item:items(name),
                        crysta_type:item_crysta_types(
                            icon:icons!item_crysta_types_icon_fkey(*),
                            icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                        )
                    ),
                    item_crystas!base_crysta(
                        upgrades:item_crysta_upgrades!item_crysta_upgrades_base_crysta_fkey(
                            crysta:item_crystas!item_crysta_upgrades_crysta_fkey(
                                item:items(name),
                                crysta_type:item_crysta_types(
                                    icon:icons!item_crysta_types_icon_fkey(*),
                                    icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                                )
                            ),
                            upgrade_for:item_crystas!item_crysta_upgrades_upgrade_for_fkey(
                                item:items(name),
                                crysta_type:item_crysta_types(
                                    icon:icons!item_crysta_types_icon_fkey(*),
                                    icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                                )
                            )
                        )
                    )
                ),
                upgrades_from_base:item_crysta_upgrades!item_crysta_upgrades_crysta_fkey(
                    base_crysta:item_crystas!item_crysta_upgrades_base_crysta_fkey(
                        item:items(name),
                        crysta_type:item_crysta_types(
                            icon:icons!item_crysta_types_icon_fkey(*),
                            icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                        )
                    ),
                    item_crystas!base_crysta(
                        upgrades:item_crysta_upgrades!item_crysta_upgrades_base_crysta_fkey(
                            crysta:item_crystas!item_crysta_upgrades_crysta_fkey(
                                item:items(name),
                                crysta_type:item_crysta_types(
                                    icon:icons!item_crysta_types_icon_fkey(*),
                                    icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                                )
                            ),
                            upgrade_for:item_crystas!item_crysta_upgrades_upgrade_for_fkey(
                                item:items(name),
                                crysta_type:item_crysta_types(
                                    icon:icons!item_crysta_types_icon_fkey(*),
                                    icon_highlighted:icons!item_crysta_types_icon_highlighted_fkey(*)
                                )
                            )
                        )
                    )
                )
            ),
            item_sellable(
                sell
            ),
            item_tool:item_tools(
                max_stack,
                duration_minute
            ),
            item_ore:item_ore(
                refine_point
            ),
            item_processable(
                process_point,
                material:item_material_types(
                    name,
                    icon:icons(*)
                )
            ),
            item_equipable(
                item_equipable_type:item_equipable_types(
                    name,
                    icon:icons(*)
                ),
                armor:item_equipable_armors(
                    base_def
                ),
                weapon:item_equipable_weapons(
                    base_atk,
                    base_stability
                )
            ),
            item_stats(
                amount,
                restriction:stat_restrictions(*),
                stat:stats(
                    stat_name,
                    stat_markdown,
                    order,
                    icon:icons(*)
                )
            ),
            item_chests!item(*),
            enemy:enemy_details(
                enemy:enemies(name),
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
                difficulty:enemy_difficulties(name)
            )
        `)
        .eq("item", item)
        .limit(7, {referencedTable: "enemy_details"})
        .single()
        .throwOnError();

    const parsed = itemView.parse(res.data);

    return parsed;
}