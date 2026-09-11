import z from "zod";

export const stoodieCreate = z.object({
    stoodie: z.object({
        stoodie: z.string().min(3),
        name: z.string().min(3),
        level: z.number().min(1).max(999),
    }),
    image: z.custom<Blob>().nullable().optional(),
});

export const stoodieUpdate = stoodieCreate.extend({
    stoodie: stoodieCreate.shape.stoodie.partial(),
    image: stoodieCreate.shape.image.optional()
});

export type StoodieCreate = z.input<typeof stoodieCreate>;
export type StoodieUpdate = z.input<typeof stoodieUpdate>;