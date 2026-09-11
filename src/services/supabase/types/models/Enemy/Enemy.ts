import z from "zod";

export const enemyModel = z.object({
    enemy: z.string(),
    name: z.string(),
});

export type Enemy = z.infer<typeof enemyModel>;