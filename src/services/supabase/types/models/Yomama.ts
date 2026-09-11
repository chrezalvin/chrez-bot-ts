import z from "zod";

export const yomamaModel = z.object({
    yomama_id: z.number(),
    message: z.string(),
});

export type Yomama = z.infer<typeof yomamaModel>;