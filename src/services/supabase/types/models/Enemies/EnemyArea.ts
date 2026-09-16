import z from "zod";
import { locationAreaModel } from "../Locations";
import { enemyModel } from "./Enemy";

export const enemyAreaModel = z.object({
    enemy: enemyModel.shape.enemy,
    area: locationAreaModel.shape.area
});

export type EnemyArea = z.infer<typeof enemyAreaModel>;