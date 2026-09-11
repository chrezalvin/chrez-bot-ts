import z from "zod";
import { enemyModel } from "../Enemy";
import { locationAreaModel } from "../Location";
import { enemyTypeModel } from "./EnemyType";
import { elementModel } from "../Element";
import { itemModel } from "../Item";

export const enemyItemDropModel = z.object({
    enemy: enemyModel.shape.enemy,
    area: locationAreaModel.shape.area,
    enemy_type: enemyTypeModel.shape.enemy_type,
    element: elementModel.shape.element,
    item: itemModel.shape.item,
    level: z.number(),
});

export type EnemyItemDrop = z.infer<typeof enemyItemDropModel>;