import z from "zod";
import { foodBuffModel } from "./FoodBuff";
import { discordUserModel } from "./DiscordUser";

export const userPreferedFoodBuffModel = z.object({
    food_buff: foodBuffModel.shape.food_buff,
    discord_user: discordUserModel.shape.user_id
});

const modelShape = userPreferedFoodBuffModel.shape;
export const userPreferedFoodBuffCreate = z.object({
    discord_user: modelShape.discord_user,
    food_buffs: modelShape.food_buff.array(),
});

export type UserPreferedFoodBuff = z.infer<typeof userPreferedFoodBuffModel>;
export type UserPreferedFoodBuffCreate = z.infer<typeof userPreferedFoodBuffCreate>;