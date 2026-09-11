import z from "zod";
import { locationTypeModel } from "./LocationType";

export const locationModel = z.object({
    location: z.string(),
    name: z.string(),
    location_type: locationTypeModel.shape.location_type,
});

export type Location = z.infer<typeof locationModel>;