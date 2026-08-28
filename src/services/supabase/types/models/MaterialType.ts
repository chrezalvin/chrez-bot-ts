import z from "zod";
import { emojiModel } from "./Emoji";

export const materialTypeModel = z.object({
    material_type: z.string(),
    name: z.string(),
    emoji: emojiModel.shape.emoji.nullable()
});

const modelShape = materialTypeModel.shape;
export const materialTypeCreate = materialTypeModel
.extend({
    material_type: modelShape.material_type.min(3),
    name: modelShape.name.min(3),
    emoji: modelShape.emoji.optional(),
});

export const materialTypeUpdate = materialTypeCreate.partial();

export type MaterialType = z.infer<typeof materialTypeModel>;
export type MaterialTypeCreate = z.infer<typeof materialTypeCreate>;
export type MaterialTypeUpdate = z.infer<typeof materialTypeUpdate>;