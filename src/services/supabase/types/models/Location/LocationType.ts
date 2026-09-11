import z from "zod";
import { iconModel } from "../Icon";

export const locationTypeModel = z.object({
    location_type: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    icon: iconModel.shape.icon.nullable(), 
});

export type LocationType = z.infer<typeof locationTypeModel>;