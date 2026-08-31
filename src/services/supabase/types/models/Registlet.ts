import z from "zod";
import { iconModel } from "./Icon";

export const registletModel = z.object({
    registlet: z.string(),
    name: z.string(),
    max_level: z.number(),
    description: z.string().nullable(),
    upgrade_cost: z.number().nullable(),
    icon: iconModel.shape.icon.nullable()
});

const modelShape = registletModel.shape;
export const registletCreate = registletModel.extend({
    registlet: modelShape.registlet.min(3),
    name: modelShape.name.min(3),
    description: modelShape.description.optional(),
    max_level: modelShape.max_level.min(1).max(999),
    upgrade_cost:modelShape.upgrade_cost.optional()
});

export const registletUpdate = registletCreate.partial();

export type Registlet = z.infer<typeof registletModel>;
export type RegistletCreate = z.infer<typeof registletCreate>;
export type RegistletUpdate = z.infer<typeof registletUpdate>;