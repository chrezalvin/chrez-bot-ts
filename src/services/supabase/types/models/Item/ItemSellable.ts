import z from "zod";
import { itemModel } from "./Item";

export const itemSellableModel = z.object({
    item: itemModel.shape.item,
    sell: z.number(),
});

export type ItemSellable = z.infer<typeof itemSellableModel>;