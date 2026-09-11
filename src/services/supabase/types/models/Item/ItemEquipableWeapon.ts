import z from "zod";
import { itemModel } from "./Item";

export const itemEquipableWeaponModel = z.object({
    weapon: itemModel.shape.item,
    base_atk: z.number().nullable(),
    base_stability: z.number().nullable(),
});

export type ItemEquipableWeapon = z.infer<typeof itemEquipableWeaponModel>;