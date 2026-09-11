import { supabaseModels } from "@shared/supabase";
import { UserPreferedFoodBuff, userPreferedFoodBuffCreate, UserPreferedFoodBuffCreate } from "@services/supabase/types";

// TODO: Update this join table
export const tableName = "user_prefered_food_buff";

export async function createUserPreferedFoodBuff(schema: UserPreferedFoodBuffCreate): Promise<UserPreferedFoodBuff[]>{
    const parsed = userPreferedFoodBuffCreate.parse(schema);

    // delete old preferred food buffs
    await deleteUserPreferedFoodBuff(schema.discord_user);

    const create = parsed.food_buffs.map(food_buff => ({food_buff, discord_user: schema.discord_user}));
    const {data} = await supabaseModels
        .from(tableName)
        .insert(create)
        .select()
        .throwOnError();

    return data!;
}

export async function deleteUserPreferedFoodBuff(
    user_id: UserPreferedFoodBuff["discord_user"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("discord_user", user_id)
        .throwOnError();

    return true;
}