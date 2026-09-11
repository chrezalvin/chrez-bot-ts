import z from "zod";

export const ailmentEffectCreate = z.object({
    ailment: z.string().min(3),
    affectee: z.string().min(3),
    description: z.string().min(1)
});

export const ailmentEffectUpdate = ailmentEffectCreate.partial();

export type AilmentEffectCreate = z.input<typeof ailmentEffectCreate>;
export type AilmentEffectUpdate = z.input<typeof ailmentEffectUpdate>;