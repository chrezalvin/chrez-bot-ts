import { foodBuffView, FoodBuffView, toramUserFoodBuffView, ToramUserFoodBuffView } from "@services/supabase/types/views/FoodBuffView";
import { supabasePublic } from "@shared/supabase";

export async function getToramUserFoodBuff(
    keyword: string
): Promise<ToramUserFoodBuffView>{
    const {data} = await supabasePublic
        .from("vw_food_buffs")
        .select(`
            name,
            image,
            aliases,
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
        `)
        .ilike("keyword", `%${keyword}%`)
        .limit(1)
        .single()
        .throwOnError();

    const parsed = toramUserFoodBuffView.parse(data);

    return parsed;
}

export async function getFoodBuff(names: string[], limit?: number): Promise<FoodBuffView[]>;
export async function getFoodBuff(name: string): Promise<FoodBuffView>;
export async function getFoodBuff(name: string | string[], limit?: number): Promise<FoodBuffView | FoodBuffView[]>{
    if(Array.isArray(name)){
        const orQuery = name
            .map(keyword => `keyword.ilike.%${keyword}%`)
            .join(',');

        const {data} = await supabasePublic
            .from("vw_food_buffs")
            .select(`
                *,
                stat:vw_stats!inner(*)
            `)
            .or(orQuery)
            .limit(limit ?? 4)
            .throwOnError();
    
        const parsed = foodBuffView.array().parse(data);
        
        return parsed;
    }
    else{
        const {data} = await supabasePublic
            .from("vw_food_buffs")
            .select(`
                *,
                stat:vw_stats!inner(*)
            `)
            .eq("stat.stat", name)
            .single()
            .throwOnError();
    
        const parsed = foodBuffView.parse(data);
        
        return parsed;
    }

}