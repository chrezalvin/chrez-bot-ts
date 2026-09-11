import z from "zod";
import { iconModel } from "../Icon";

export const itemEquipableTypeModel = z.object({
    name: z.string(),
    icon: iconModel.shape.icon,
    equipment_type: z.string(),
});

export type ItemEquipableType = z.infer<typeof itemEquipableTypeModel>;