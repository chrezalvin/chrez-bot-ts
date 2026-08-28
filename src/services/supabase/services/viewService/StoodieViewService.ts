import { stoodieView, StoodieView } from "@services/supabase/types/views/StoodieView";
import { supabasePublic } from "@shared/supabase";

export async function getStoodieByKeyword(keyword: string): Promise<StoodieView[]>{
    const {data} = await supabasePublic
        .from("vw_stoodies")
        .select(`
            *,
            registlets:vw_stoodie_registlets!inner(
                *
            )
        `)
        .ilike("name", `%${keyword}%`)
        .limit(3);

    const parsed = stoodieView.array().parse(data);
    
    return parsed;
}

export async function getStoodie(stoodie: StoodieView["stoodie"]): Promise<StoodieView | null>{
    const {data} = await supabasePublic
        .from("vw_stoodies")
        .select(`
            *,
            registlets:vw_stoodie_registlets!inner(
                *
            )
        `)
        .eq("stoodie", stoodie);

    const parsed = stoodieView.nullable().parse(data);
    
    return parsed;
}