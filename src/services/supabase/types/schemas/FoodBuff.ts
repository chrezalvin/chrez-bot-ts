import z from "zod";

export const foodBuffCreate = z.object({
    foodBuff: z.object({
        stat: z.string().min(3).nullable().optional(),
        food_buff: z.string().min(3),
        stat_growth: z.number().min(1).max(10).array().length(10),
        ingredient_cost: z.number().min(0),
        name: z.string().min(3),
    }),
    image: z.custom<Blob>().nullable().optional()
});

export const foodBuffUpdate = foodBuffCreate.extend({
    foodBuff: foodBuffCreate.shape.foodBuff.partial(),
    image: foodBuffCreate.shape.image.optional()
});

export type FoodBuffCreate = z.input<typeof foodBuffCreate>;
export type FoodBuffUpdate = z.input<typeof foodBuffUpdate>;