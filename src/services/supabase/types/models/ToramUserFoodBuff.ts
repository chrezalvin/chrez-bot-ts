import z from "zod";
import { foodBuffModel } from "./FoodBuff";
import { toramUserModel } from "./ToramUser";

export const toramUserFoodBuffModel = z.object({
    food_buff: foodBuffModel.shape.food_buff,
    toram_user: toramUserModel.shape.toram_user,
    level: z.number()
});

const modelShape = toramUserFoodBuffModel.shape;
export const toramUserFoodBuffCreate = toramUserFoodBuffModel.extend({
    food_buff: modelShape.food_buff,
    toram_user: modelShape.toram_user,
    level: modelShape.level.max(10).min(1)
});

export const toramUserFoodBuffUpdate = toramUserFoodBuffCreate.partial();

export type ToramUserFoodBuff = z.infer<typeof toramUserFoodBuffModel>;
export type ToramUserFoodBuffCreate = z.infer<typeof toramUserFoodBuffCreate>;
export type ToramUserFoodBuffUpdate = z.infer<typeof toramUserFoodBuffUpdate>;