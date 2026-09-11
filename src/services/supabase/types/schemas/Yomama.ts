import z from "zod";

export const yomamaCreate = z.object({
    message: z.string().min(3),
});

export const yomamaUpdate = yomamaCreate.partial();

export type YomamaCreate = z.input<typeof yomamaCreate>;
export type YomamaUpdate = z.input<typeof yomamaUpdate>;