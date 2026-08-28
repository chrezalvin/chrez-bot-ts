import z from "zod";
import { elementCreate, elementModel } from "./Element";

export const enemyModel = z.object({
    enemy: z.string(),
    name: z.string(),
    element: elementModel.shape.element
});

const modelShape = enemyModel.shape;
export const enemyCreate = enemyModel
.extend({
    enemy: modelShape.enemy.min(3),
    name: modelShape.name.min(3),
    element: elementCreate.shape.element
});

export const enemyUpdate = enemyCreate.partial();

export type Enemy = z.infer<typeof enemyModel>;
export type EnemyCreate = z.infer<typeof enemyCreate>;
export type EnemyUpdate = z.infer<typeof enemyUpdate>;