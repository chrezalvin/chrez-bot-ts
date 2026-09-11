import z from "zod";

export const stoodieModel = z.object({
    stoodie: z.string(),
    name: z.string(),
    level: z.number(),
    image: z.string().nullable()
});

export type Stoodie = z.infer<typeof stoodieModel>;