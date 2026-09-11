import z from "zod";
import { ailmentAffecteeModel } from "./AilmentAffecte";
import { ailmentModel } from "./Ailment";

export const ailmentEffectModel = z.object({
    ailment: ailmentModel.shape.ailment,
    affectee: ailmentAffecteeModel.shape.ailment_affectee,
    description: z.string().array()
});

export type AilmentEffect = z.infer<typeof ailmentEffectModel>;