import z from "zod";
import { elementModel } from "../Element";
import { enemyTypeModel } from "./EnemyType";
import { enemyNameModel } from "./EnemyName";

export const enemyModel = z.object({
    enemy: z.string(),
    enemy_name: enemyNameModel.shape.enemy,
    element: elementModel.shape.element,
    level: z.number(),
    enemy_type: enemyTypeModel.shape.enemy_type,
    base_exp: z.number().nullable(),
    hp: z.number().nullable(),
    difficulty_label: z.string().nullable(),
    variant_label: z.string().nullable(),
});

export type Enemy = z.infer<typeof enemyModel>;