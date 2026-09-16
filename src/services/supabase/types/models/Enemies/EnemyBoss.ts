import z from "zod";
import { enemyModel } from "./Enemy";

export const enemyBossModel = z.object({
    enemy: enemyModel.shape.enemy,
    has_difficulty: z.boolean()
});

export type EnemyBoss = z.infer<typeof enemyBossModel>;