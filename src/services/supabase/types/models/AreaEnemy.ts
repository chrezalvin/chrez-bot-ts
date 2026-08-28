import z from "zod";
import { areaModel } from "./Area";
import { enemyModel } from "./Enemy";

export const areaEnemyModel = z.object({
    area: areaModel.shape.area,
    enemy: enemyModel.shape.enemy,
    level: z.number(),
    base_exp: z.number()
});

const modelShape = areaEnemyModel.shape;
export const areaEnemyCreate = areaEnemyModel
.extend({
    area: modelShape.area,
    enemy: modelShape.enemy,
    level: modelShape.level.min(1),
    base_exp: modelShape.base_exp.min(1).optional()
});

export const areaEnemyUpdate = areaEnemyCreate.partial();

export type AreaEnemy = z.infer<typeof areaEnemyModel>;
export type AreaEnemyCreate = z.infer<typeof areaEnemyCreate>;
export type AreaEnemyUpdate = z.infer<typeof areaEnemyUpdate>;