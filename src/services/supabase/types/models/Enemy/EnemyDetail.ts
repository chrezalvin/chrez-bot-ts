import z from "zod";
import { enemyModel } from "../Enemy";
import { locationAreaModel } from "../Location";
import { enemyTypeModel } from "./EnemyType";
import { elementModel } from "../Element";
import { enemyDifficultyModel } from "./EnemyDifficulty";

export const enemyDetailModel = z.object({
    enemy: enemyModel.shape.enemy,
    area: locationAreaModel.shape.area,
    enemy_type: enemyTypeModel.shape.enemy_type,
    element: elementModel.shape.element,
    enemy_difficulty: enemyDifficultyModel.shape.enemy_difficulty,
    level: z.number(),
    base_exp: z.number().nullable(),
    hp: z.number().nullable(),
});

export type EnemyDetail = z.infer<typeof enemyDetailModel>;