import z from "zod";
import { iconModel } from "./Icon";

export const gearTypeModel = z.object({
    gear_type: z.string(),
    gear_name: z.string(),
    aliases: z.array(z.string()).nullable(),
    icon: iconModel.shape.icon,
});

const modelShape = gearTypeModel.shape;
export const gearTypeCreate = gearTypeModel
.extend({
    gear_type: modelShape.gear_type,
    gear_name: modelShape.gear_name,
    aliases: modelShape.aliases.optional(),
    icon: modelShape.icon,
});

export const gearTypeUpdate = gearTypeCreate.partial();

export type GearType = z.infer<typeof gearTypeModel>;
export type GearTypeCreate = z.infer<typeof gearTypeCreate>;
export type GearTypeUpdate = z.infer<typeof gearTypeUpdate>;