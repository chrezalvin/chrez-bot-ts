import z from "zod";

export const traitModel = z.object({
    trait: z.string(),
    name: z.string(),
    description: z.string(),
    extra: z.string().nullable(),
});

export type Trait = z.infer<typeof traitModel>;