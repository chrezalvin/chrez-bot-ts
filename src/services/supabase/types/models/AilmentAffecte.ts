import z from "zod";

export const ailmentAffecteeModel = z.object({
    ailment_affectee: z.string(),
    name: z.string(),
    description: z.string()
});

export type AilmentAffectee = z.infer<typeof ailmentAffecteeModel>;