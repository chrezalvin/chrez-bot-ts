import z from "zod";

export const registletModel = z.object({
    registlet: z.string(),
    name: z.string(),
    max_level: z.number(),
    description: z.string().nullable(),
    image: z.string().nullable()
});

const modelShape = registletModel.shape;
export const registletCreate = z.object({
    registlet: registletModel.omit({
        image: true
    }).extend({
        registlet: modelShape.registlet.min(3),
        name: modelShape.name.min(3),
        description: modelShape.description.optional(),
        max_level: modelShape.max_level.min(1).max(999),
    }),
    image: z.custom<Blob>().nullable().optional()
});

export const registletUpdate = registletCreate.extend({
    registlet: registletCreate.shape.registlet.partial(),
    image: registletCreate.shape.image.optional()
});

export type Registlet = z.infer<typeof registletModel>;
export type RegistletCreate = z.infer<typeof registletCreate>;
export type RegistletUpdate = z.infer<typeof registletUpdate>;