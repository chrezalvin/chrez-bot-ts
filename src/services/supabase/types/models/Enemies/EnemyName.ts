import z from "zod";

export const enemyNameModel = z.object({
    enemy: z.string(),
    name: z.string(),
});

export type EnemyName = z.infer<typeof enemyNameModel>;