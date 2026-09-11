import z from "zod";

export const traitCreate = z.object({
    trait: z.string().min(3),
    name: z.string().min(3),
    description: z.string().min(3),
    extra: z.string().nullable().optional(),
});

export const traitUpdate = traitCreate.partial();

export type TraitCreate = z.input<typeof traitCreate>;
export type TraitUpdate = z.input<typeof traitUpdate>;