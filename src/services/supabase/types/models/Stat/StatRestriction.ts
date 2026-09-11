import z from "zod";
import { iconModel } from "../Icon";

export const statRestrictionModel = z.object({
    stat_restriction: z.string(),
    name: z.string(),
    icon: iconModel.shape.icon.nullable(),
    id_ref: z.number().nullable(),
});

export type StatRestriction = z.infer<typeof statRestrictionModel>;