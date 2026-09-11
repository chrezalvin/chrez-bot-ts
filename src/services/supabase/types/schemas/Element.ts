import z from "zod";

export const elementCreate = z.object({
    element: z.string().min(3),
    name: z.string().min(3),
});

export const elementUpdate = elementCreate.partial();

export type ElementCreate = z.input<typeof elementCreate>;
export type ElementUpdate = z.input<typeof elementUpdate>;