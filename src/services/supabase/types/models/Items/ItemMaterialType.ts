import z from "zod";
import { iconModel } from "../Icon";

export const itemMaterialTypeModel = z.object({
    material_type: z.string(),
    name: z.string(),
    icon: iconModel.shape.icon,
});

export type ItemMaterialType = z.infer<typeof itemMaterialTypeModel>;