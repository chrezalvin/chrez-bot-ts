import z from "zod";
import { enemyModel } from ".";
import { itemModel } from "../Items";

export const enemyItemDropModel = z.object({
    enemy: enemyModel.shape.enemy,
    item: itemModel.shape.item,
});

export type EnemyItemDrop = z.infer<typeof enemyItemDropModel>;