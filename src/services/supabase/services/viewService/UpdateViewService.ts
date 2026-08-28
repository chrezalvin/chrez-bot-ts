import { UpdateView, updateView } from "@services/supabase/types/views/UpdateView";
import { supabasePublic } from "@shared/supabase";

export async function getUpdate(version: string): Promise<UpdateView>{
    const {data} = await supabasePublic
        .from("vw_updates")
        .select(`*`)
        .ilike("version", version)
        .limit(1)
        .single()
        .throwOnError();

    const parsed = updateView.parse(data);
    
    return parsed;
}