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

export type Registlet = z.infer<typeof registletModel>;