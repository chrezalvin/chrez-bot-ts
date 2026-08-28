import { FoodBuffViewService, UserPreferedFoodBuffViewService } from "../viewService";
import { UserPreferredFoodBuffService } from "../modelService";
import { UserPreferedFoodBuffView } from "@services/supabase/types/views/UserPreferedFoodBuff";
import { DiscordUserView } from "@services/supabase/types/views/DiscordUserView";

const cache = new Map<DiscordUserView["user_id"], UserPreferedFoodBuffView[]>();

export async function getUserPreferedFoodBuff(user_id: DiscordUserView["user_id"]): Promise<UserPreferedFoodBuffView[]>{
    if(cache.has(user_id))
        return cache.get(user_id)!;

    const get = await UserPreferedFoodBuffViewService.getUserPreferedFoodBuffs(user_id);

    cache.set(user_id, get);

    return get;
}

export async function setUserPreferedFoodBuff(user_id: DiscordUserView["user_id"], keywords: string[]): Promise<UserPreferedFoodBuffView[]>{
    const foodBuffs = await FoodBuffViewService.getFoodBuff(keywords);

    await UserPreferredFoodBuffService.createUserPreferedFoodBuff({
        discord_user: user_id,
        food_buffs: foodBuffs.map(food => food.food_buff),
    });
    
    const get = await UserPreferedFoodBuffViewService.getUserPreferedFoodBuffs(user_id);

    cache.set(user_id, get);

    return get;
}