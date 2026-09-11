import z from "zod";
import { itemModel } from "./Item";

export const itemEquipableArmorModel = z.object({
    armor: itemModel.shape.item,
    base_def: z.number().nullable(),
});

export type ItemEquipableArmor = z.infer<typeof itemEquipableArmorModel>;