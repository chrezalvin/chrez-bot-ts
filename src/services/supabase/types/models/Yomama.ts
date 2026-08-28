import z from "zod";

export const yomamaModel = z.object({
    yomama_id: z.number(),
    message: z.string(),
});

const modelShape = yomamaModel.shape;
export const yomamaCreate = yomamaModel.extend({
    message: modelShape.message.min(3),
});

export const yomamaUpdate = yomamaCreate.partial();

export type Yomama = z.infer<typeof yomamaModel>;
export type YomamaCreate = z.infer<typeof yomamaCreate>;
export type YomamaUpdate = z.infer<typeof yomamaUpdate>;