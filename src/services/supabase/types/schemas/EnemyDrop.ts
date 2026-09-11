import z from "zod";
export const enemyDropCreate = z.object({
    enemy: z.string().min(3),
    material: z.string().min(3)
});

export const enemyDropUpdate = enemyDropCreate.partial();

export type EnemyDropCreate = z.input<typeof enemyDropCreate>;
export type EnemyDropUpdate = z.input<typeof enemyDropUpdate>;