import z from "zod";

export const ailmentAffecteeCreate = z.object({
    ailment_affectee: z.string().min(3),
    name: z.string().min(3),
    description: z.string().min(3)
});

export const ailmentAffecteeUpdate = ailmentAffecteeCreate.partial();

export type AilmentAffecteeCreate = z.input<typeof ailmentAffecteeCreate>;
export type AilmentAffecteeUpdate = z.input<typeof ailmentAffecteeUpdate>;