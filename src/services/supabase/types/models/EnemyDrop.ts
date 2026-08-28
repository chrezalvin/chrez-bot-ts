import z from "zod";
import { enemyModel } from "./Enemy";
import { materialModel } from "./Material";

export const enemyDropModel = z.object({
    enemy: enemyModel.shape.enemy,
    material: materialModel.shape.material,
});

const modelShape = enemyDropModel.shape;
export const enemyDropCreate = enemyDropModel
.extend({
    enemy: modelShape.enemy,
    material: modelShape.material
});

export const enemyDropUpdate = enemyDropCreate.partial();

export type EnemyDrop = z.infer<typeof enemyDropModel>;
export type EnemyDropCreate = z.infer<typeof enemyDropCreate>;
export type EnemyDropUpdate = z.infer<typeof enemyDropUpdate>;