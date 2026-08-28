import z from "zod";

export const translateModel = z.object({
    translate_id: z.number(),
    name: z.array(z.string()),
    explanations: z.array(z.string()),
    conotation: z.enum(["negative", "positive", "neutral"]),
});

const modelShape = translateModel.shape;
export const translateCreate = translateModel.extend({
    name: modelShape.name.min(1),
    explanations: modelShape.explanations.min(1),
    conotation: modelShape.conotation.optional(),
});

export const translateUpdate = translateCreate.partial();

export type Translate = z.infer<typeof translateModel>;
export type TranslateCreate = z.infer<typeof translateCreate>;
export type TranslateUpdate = z.infer<typeof translateUpdate>;