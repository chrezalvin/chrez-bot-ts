import z from "zod";
import { itemModel } from "./Item";

export const itemCollectibleModel = z.object({
    collectible: itemModel.shape.item,
    max_stack: z.number(),
});

export type ItemCollectible = z.infer<typeof itemCollectibleModel>;