import z from "zod";
import { iconModel } from "../Icon";

export const enemyTypeModel = z.object({
    enemy_type: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    icon: iconModel.shape.icon.nullable()
});

export type EnemyType = z.infer<typeof enemyTypeModel>;