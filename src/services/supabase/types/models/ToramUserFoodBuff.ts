import z from "zod";
import { foodBuffModel } from "./FoodBuff";
import { toramUserModel } from "./ToramUser";

export const toramUserFoodBuffModel = z.object({
    food_buff: foodBuffModel.shape.food_buff,
    toram_user: toramUserModel.shape.toram_user,
    level: z.number()
});

export type ToramUserFoodBuff = z.infer<typeof toramUserFoodBuffModel>;