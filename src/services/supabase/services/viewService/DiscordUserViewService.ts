import { DiscordUser } from "@services/supabase/types/models/DiscordUser";
import { discordUserView, DiscordUserView } from "@services/supabase/types/views/DiscordUserView";
import { supabasePublic } from "@shared/supabase";

export async function getDiscordUser(
    user_id: DiscordUser["user_id"]
): Promise<DiscordUserView | null>{
    const {data} = await supabasePublic
        .from("vw_discord_users")
        .select()
        .eq("user_id", user_id)
        .single();

    const parsed = discordUserView.nullable().parse(data);

    return parsed;
}

export async function getDiscordUsers(options?: {
    birthday?: {
        month: number,
        day: number
    },
    role?: string,
    keyword?: string
}): Promise<DiscordUserView[]>{
    const query = supabasePublic
        .from("vw_discord_users")
        .select()

    if(options?.birthday)
        query
            .eq("birthday_month", options.birthday.month)
            .eq("birthday_day", options.birthday.day);

    if(options?.role)
        query.eq("role", options.role)

    if(options?.keyword)
        query.eq("keyword", options.keyword)

    const {data} = await query;

    const parsed = discordUserView.array().parse(data);

    return parsed;
}