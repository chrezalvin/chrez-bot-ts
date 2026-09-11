import z from "zod";
import { foodBuffModel } from "./FoodBuff";
import { discordUserModel } from "./DiscordUser";

export const userPreferedFoodBuffModel = z.object({
    food_buff: foodBuffModel.shape.food_buff,
    discord_user: discordUserModel.shape.user_id
});

export type UserPreferedFoodBuff = z.infer<typeof userPreferedFoodBuffModel>;