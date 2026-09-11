import z from "zod";
import { itemChestModel } from "./ItemChest";
import { itemModel } from "./Item";

export const itemChestDropModel = z.object({
    item_chest: itemChestModel.shape.item,
    drop: itemModel.shape.item,
    quantity: z.number(),
});

export type ItemChestDrop = z.infer<typeof itemChestDropModel>;