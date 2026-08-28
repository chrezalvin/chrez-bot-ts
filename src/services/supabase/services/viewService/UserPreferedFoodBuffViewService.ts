import { DiscordUserView } from "@services/supabase/types/views/DiscordUserView";
import { userPreferedFoodBuffView, UserPreferedFoodBuffView } from "@services/supabase/types/views/UserPreferedFoodBuff";
import { supabasePublic } from "@shared/supabase";

export async function getUserPreferedFoodBuffs(user_id: DiscordUserView["user_id"]): Promise<UserPreferedFoodBuffView[]>{
    const {data} = await supabasePublic
        .from("vw_user_prefered_food_buff")
        .select(`
            discord_user,
            food_buff:vw_food_buffs(
                name,
                stat:vw_stats!inner(*),
                toram_user_food_buffs:vw_toram_user_food_buffs(
                    level,
                    toram_user:vw_toram_users(
                        land_address,
                        toram_user,
                        updated_at,
                        discord_user:vw_discord_users(
                            user_id,
                            username
                        )
                    )
                )
            )
        `)
        .eq("discord_user", user_id)
        .throwOnError();

    const parsed = userPreferedFoodBuffView.array().parse(data);
    
    return parsed;
}