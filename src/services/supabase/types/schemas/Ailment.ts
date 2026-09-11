import z from "zod";

export const ailmentCreate = z.object({
    ailment: z.string().min(3),
    name: z.string().min(3),
    icon: z.string().min(3).nullable().optional()
});

export const ailmentUpdate = ailmentCreate.partial();

export type AilmentCreate = z.input<typeof ailmentCreate>;
export type AilmentUpdate = z.input<typeof ailmentUpdate>;