import z from "zod";
import { itemModel } from "./Item";
import { itemMaterialTypeModel } from "./ItemMaterialType";

export const itemProcessableModel = z.object({
    item: itemModel.shape.item,
    material_type: itemMaterialTypeModel.shape.material_type,
    process_point: z.number(),
});

export type ItemProcessable = z.infer<typeof itemProcessableModel>;