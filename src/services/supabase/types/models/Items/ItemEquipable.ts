import z from "zod";
import { itemModel } from "./Item";
import { itemEquipableTypeModel } from "./ItemEquipableType";

export const itemEquipableModel = z.object({
    item: itemModel.shape.item,
    equipment_type: itemEquipableTypeModel.shape.equipment_type,
});

export type ItemEquipable = z.infer<typeof itemEquipableModel>;