import { supabaseModels } from "@shared/supabase";

export async function getCrysta(crysta: string){
    const res = await supabaseModels
        .from("item_crystas")
        .select(`
            item:items(
                *,
                item_processable(*),
                item_sellable(*)
            ),
            crysta_type:item_crysta_types(
                name,
                icon:icons(*)
            ),
            upgrades:item_crysta_upgrades!item_crysta_upgrades_upgrade_for_fkey(
                item_crystas!base_crysta(
                    upgrades:item_crysta_upgrades!item_crysta_upgrades_base_crysta_fkey(
                        crysta:item_crystas!item_crysta_upgrades_crysta_fkey(
                            item:items(name),
                            crysta_type:item_crysta_types(
                                icon:icons(*)
                            )
                        ),
                        upgrade_for:item_crystas!item_crysta_upgrades_upgrade_for_fkey(
                            item:items(name),
                            crysta_type:item_crysta_types(
                                icon:icons(*)
                            )
                        )
                    )
                )
            )
        `)
        .eq("crysta", crysta)
        .throwOnError();

    return res.data;
}

export async function getCrystas(keyword: string){

}