import { registletView, RegistletView } from "@services/supabase/types/views/RegistletView";
import { supabasePublic } from "@shared/supabase";

export async function getRegistlets(keyword: string): Promise<RegistletView[]>{
    const {data} = await supabasePublic
        .from("vw_registlets")
        .select(`
            *,
            stoodies:vw_stoodies!vw_stoodie_registlets(*)
        `)
        .ilike("name", `%${keyword}%`)
        .limit(3)
        .throwOnError();

    const parsed = registletView.array().parse(data);
    
    return parsed;
}
