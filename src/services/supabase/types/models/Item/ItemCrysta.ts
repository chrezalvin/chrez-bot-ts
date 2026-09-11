import z from "zod";
import { itemCrystaTypeModel } from "./ItemCrystaType";

export const itemCrystaModel = z.object({
    crysta_type: itemCrystaTypeModel.shape.crysta_type,
    crysta: z.string()
});

export type ItemCrysta = z.infer<typeof itemCrystaModel>;