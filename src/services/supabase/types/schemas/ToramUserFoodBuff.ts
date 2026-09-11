import z from "zod";

export const toramUserFoodBuffCreate = z.object({
    food_buff: z.string().min(3),
    toram_user: z.string().min(3),
    level: z.number().max(10).min(1)
});

export const toramUserFoodBuffUpdate = toramUserFoodBuffCreate.partial();

export type ToramUserFoodBuffCreate = z.input<typeof toramUserFoodBuffCreate>;
export type ToramUserFoodBuffUpdate = z.input<typeof toramUserFoodBuffUpdate>;