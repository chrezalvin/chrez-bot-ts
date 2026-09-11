import z from "zod";

export const itemModel = z.object({
    item: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    is_verified: z.boolean(),
});

export type Item = z.infer<typeof itemModel>;