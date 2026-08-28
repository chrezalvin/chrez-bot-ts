import z from "zod";

export const stoodieModel = z.object({
    stoodie: z.string(),
    name: z.string(),
    level: z.number(),
    image: z.string().nullable()
});

const modelShape = stoodieModel.shape;
export const stoodieCreate = z.object({
    stoodie: stoodieModel.omit({
        image: true,
    }).extend({
        stoodie: modelShape.stoodie.min(3),
        name: modelShape.name.min(3),
        level: modelShape.level.min(1).max(999),
    }),
    image: z.custom<Blob>().nullable().optional(),
});

export const stoodieUpdate = stoodieCreate.extend({
    stoodie: stoodieCreate.shape.stoodie.partial(),
    image: stoodieCreate.shape.image.optional()
});

export type Stoodie = z.infer<typeof stoodieModel>;
export type StoodieCreate = z.infer<typeof stoodieCreate>;
export type StoodieUpdate = z.infer<typeof stoodieUpdate>;