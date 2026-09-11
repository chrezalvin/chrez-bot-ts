import z from "zod";

export const translateModel = z.object({
    translate_id: z.number(),
    name: z.array(z.string()),
    explanations: z.array(z.string()),
    conotation: z.enum(["negative", "positive", "neutral"]),
});

export type Translate = z.infer<typeof translateModel>;