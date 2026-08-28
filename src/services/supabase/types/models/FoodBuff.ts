import z from "zod";
import { statModel } from "./Stat";

export const foodBuffModel = z.object({
    food_buff: z.string(),
    name: z.string(),
    stat: statModel.shape.stat.nullable(),
    stat_growth: z.array(z.number()),
    ingredient_cost: z.number(),
    image: z.string().nullable(),
});

const modelShape = foodBuffModel.shape;
export const foodBuffCreate = z.object({
    foodBuff: foodBuffModel.omit({
        image: true,
    }).extend({
        food_buff: modelShape.food_buff.min(3),
        stat_growth: modelShape.stat_growth.length(10),
        ingredient_cost: modelShape.ingredient_cost.min(0),
        name: modelShape.name.min(3),
    }),
    image: z.custom<Blob>().nullable().optional()
});

export const foodBuffUpdate = foodBuffCreate.extend({
    foodBuff: foodBuffCreate.shape.foodBuff.partial(),
    image: foodBuffCreate.shape.image.optional()
});

export type FoodBuff = z.infer<typeof foodBuffModel>;
export type FoodBuffCreate = z.infer<typeof foodBuffCreate>;
export type FoodBuffUpdate = z.infer<typeof foodBuffUpdate>;