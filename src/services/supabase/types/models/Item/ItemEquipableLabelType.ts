import z from "zod";
import { iconModel } from "../Icon";

export const itemEquipableLabelTypeModel = z.object({
    name: z.string(),
    icon: iconModel.shape.icon,
    label: z.string(),
});

export type ItemEquipableLabelType = z.infer<typeof itemEquipableLabelTypeModel>;