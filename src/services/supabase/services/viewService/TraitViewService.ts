import { traitView, TraitView } from "@services/supabase/types/views/TraitView";
import { supabasePublic } from "@shared/supabase";

export async function getTraits(keyword: string): Promise<TraitView[]>{
    const {data} = await supabasePublic
        .from("vw_traits")
        .select()
        .ilike("name", `%${keyword}%`)
        .limit(3)
        .throwOnError();

    const parsed = traitView.array().parse(data);
    
    return parsed;
}