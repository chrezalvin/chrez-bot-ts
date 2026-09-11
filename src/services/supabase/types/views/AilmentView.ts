import z from "zod";
import { ailmentModel } from "../models/Ailment";
import { ailmentEffectModel } from "../models/AilmentEffect";
import { ailmentAffecteeModel } from "../models/AilmentAffecte";
import { iconModel } from "../models/Icon";

export const ailmentView = ailmentModel.extend({
    icon: iconModel.nullable(),
    ailment_effects: ailmentEffectModel.pick({
        description: true
    }).extend({
        affectee: ailmentAffecteeModel
    }).array()
});

export type AilmentView = z.infer<typeof ailmentView>;