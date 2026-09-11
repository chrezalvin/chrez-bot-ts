import z from "zod";
import { itemModel } from "./Item";

export const itemOreModel = z.object({
    item: itemModel.shape.item,
    refine_point: z.number(),
});

export type ItemOre = z.infer<typeof itemOreModel>;