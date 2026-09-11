import z from "zod";

export const updateCreate = z.object({
    version: z.string().min(3).min(3),
    bugfix: z.string().min(3).array().min(1).nullable().optional(),
    news: z.string().min(3).array().min(1).nullable().optional(),
});

export const updateUpdate = updateCreate.partial();

export type UpdateCreate = z.input<typeof updateCreate>;
export type UpdateUpdate = z.input<typeof updateUpdate>;