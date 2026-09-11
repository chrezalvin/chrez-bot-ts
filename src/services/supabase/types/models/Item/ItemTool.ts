import z from "zod";
import { itemModel } from "./Item";

export const itemToolModel = z.object({
    tool: itemModel.shape.item,
    max_stack: z.number(),
    duration_minute: z.number().nullable(),
});

export type ItemTool = z.infer<typeof itemToolModel>;