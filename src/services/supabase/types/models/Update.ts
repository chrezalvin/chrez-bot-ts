import z from "zod";

export const updateModel = z.object({
    version: z.string(),
    bugfix: z.array(z.string()).nullable(),
    news: z.array(z.string()).nullable(),
});

export type Update = z.infer<typeof updateModel>;