import { registletView, RegistletView } from "@services/supabase/types/views/RegistletView";
import { supabasePublic } from "@shared/supabase";

export async function getRegistlets(keyword: string): Promise<RegistletView[]>{
    const {data} = await supabasePublic
        .from("vw_registlets")
        .select(`
            description,
            max_level,
            name,
            registlet,
            upgrade_cost,
            stoodies:vw_stoodies!vw_stoodie_registlets(*),
            icon:vw_icons(*)
        `)
        .ilike("name", `%${keyword}%`)
        .limit(3)
        .throwOnError();

    const parsed = registletView.array().parse(data);
    
    return parsed;
}
