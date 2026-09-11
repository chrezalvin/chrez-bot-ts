import { AilmentView, ailmentView } from "@services/supabase/types/views/AilmentView";
import { supabasePublic } from "@shared/supabase";

export async function getAilment(name: string): Promise<AilmentView[]>{
    const {data} = await supabasePublic
        .from("vw_ailments")
        .select(`
            ailment,
            name,
            icon:vw_icons(*),
            ailment_effects:vw_ailment_effects(
                affectee:vw_ailment_affectees(*),
                description
            )
        `)
        .ilike("name", `%${name}%`)
        .limit(3);

    const parsed = ailmentView.array().parse(data);
    
    return parsed;
}