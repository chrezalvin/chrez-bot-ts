import z from "zod";

export const elementModel = z.object({
    element: z.string(),
    name: z.string(),
});

const modelShape = elementModel.shape;
export const elementCreate = elementModel
.extend({
    element: modelShape.element.min(3),
    name: modelShape.name.min(3),
});

export const elementUpdate = elementCreate.partial();

export type Element = z.infer<typeof elementModel>;
export type ElementCreate = z.infer<typeof elementCreate>;
export type ElementUpdate = z.infer<typeof elementUpdate>;