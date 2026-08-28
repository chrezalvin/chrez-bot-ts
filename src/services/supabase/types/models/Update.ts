import z from "zod";

export const updateModel = z.object({
    version: z.string(),
    bugfix: z.array(z.string()).nullable(),
    news: z.array(z.string()).nullable(),
});

const modelShape = updateModel.shape;
export const updateCreate = updateModel.extend({
    version: modelShape.version.min(3),
    bugfix: modelShape.bugfix.optional(),
    news: modelShape.news.optional(),
});

export const updateUpdate = updateCreate.partial();

export type Update = z.infer<typeof updateModel>;
export type UpdateCreate = z.infer<typeof updateCreate>;
export type UpdateUpdate = z.infer<typeof updateUpdate>;