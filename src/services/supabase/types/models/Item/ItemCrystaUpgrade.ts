import z from "zod";
import { itemCrystaModel } from "./ItemCrysta";

export const itemCrystaUpgradeModel = z.object({
    crysta: itemCrystaModel.shape.crysta,
    base_crysta: itemCrystaModel.shape.crysta,
    upgrade_for: itemCrystaModel.shape.crysta,
});

export type ItemCrystaUpgrade = z.infer<typeof itemCrystaUpgradeModel>;