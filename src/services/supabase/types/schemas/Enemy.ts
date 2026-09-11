import z from "zod";

export const enemyCreate = z.object({
    enemy: z.string().min(3),
    name: z.string().min(3),
    element: z.string().min(3)
});

export const enemyUpdate = enemyCreate.partial();

export type EnemyCreate = z.input<typeof enemyCreate>;
export type EnemyUpdate = z.input<typeof enemyUpdate>;