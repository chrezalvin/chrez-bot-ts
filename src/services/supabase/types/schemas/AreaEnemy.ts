import z from "zod";

export const areaEnemyCreate = z.object({
    area: z.string().min(3),
    enemy: z.string().min(3),
    level: z.number().min(1).max(999),
    base_exp: z.number().min(1).max(999).optional()
});

export const areaEnemyUpdate = areaEnemyCreate.partial();

export type AreaEnemyCreate = z.input<typeof areaEnemyCreate>;
export type AreaEnemyUpdate = z.input<typeof areaEnemyUpdate>;