import z from "zod";

export const translateCreate = z.object({
    name: z.string().min(3).array().min(1),
    explanations: z.string().min(3).array().min(1),
    conotation: z.enum(["negative", "positive", "neutral"]).optional(),
});

export const translateUpdate = translateCreate.partial();

export type TranslateCreate = z.input<typeof translateCreate>;
export type TranslateUpdate = z.input<typeof translateUpdate>;