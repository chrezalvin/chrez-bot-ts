import z from "zod";
import { elementCreate, elementModel } from "./Element";
import { materialTypeModel } from "./MaterialType";

export const materialModel = z.object({
    material: z.string(),
    name: z.string(),
    material_point: z.number(),
    material_type: materialTypeModel.shape.material_type.nullable(),
});

const modelShape = materialModel.shape;
export const materialCreate = materialModel
.extend({
    material: modelShape.material.min(3),
    name: modelShape.name.min(3),
    material_point: modelShape.material_point.min(0),
    material_type: modelShape.material_type.optional(),
});

export const materialUpdate = materialCreate.partial();

export type Material = z.infer<typeof materialModel>;
export type MaterialCreate = z.infer<typeof materialCreate>;
export type MaterialUpdate = z.infer<typeof materialUpdate>;