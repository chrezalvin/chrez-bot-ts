import z from "zod";

export const userPreferedFoodBuffCreate = z.object({
    discord_user: z.string().min(3),
    food_buffs: z.string().min(3).array(),
});

export type UserPreferedFoodBuffCreate = z.input<typeof userPreferedFoodBuffCreate>;