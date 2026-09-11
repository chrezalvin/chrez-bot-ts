import z from "zod";
import { locationModel } from "./Location";

export const locationAreaModel = z.object({
    area: z.string(),
    location: locationModel.shape.location,
    name: z.string(),
});

export type LocationArea = z.infer<typeof locationAreaModel>;