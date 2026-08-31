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
            ),
            user:vw_discord_users(
                user_id
            )
        `)
        .ilike("keyword", `%${keyword}%`)
        .limit(10);

    // prioritize row that has user first
    const found = data?.find((e, idx) => {
        if(data.length === idx + 1)
            return true;
        else
            return e.user.length > 0;
    })

    const parsed = timezoneView.parse(found);

    return parsed;
}