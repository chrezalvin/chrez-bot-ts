import z from "zod";

export const elementModel = z.object({
    element: z.string(),
    name: z.string(),
});

export type Element = z.infer<typeof elementModel>;