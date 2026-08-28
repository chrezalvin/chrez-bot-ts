import { timezoneView, TimezoneView } from "@services/supabase/types/views/TimezoneView";
import { supabasePublic } from "@shared/supabase";

export async function getTimezone(
    keyword: string
): Promise<TimezoneView>{
    const {data} = await supabasePublic
        .from("vw_timezones")
        .select(`
            timezone,
            country:vw_countries(
                name,
                flag
            )
        `)
        .ilike("keyword", `%${keyword}%`)
        .limit(1)
        .single()
        .throwOnError();

    const parsed = timezoneView.parse(data);

    return parsed;
}