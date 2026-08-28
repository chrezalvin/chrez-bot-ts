import z from "zod";
import { locationModel } from "./Location";

export const areaModel = z.object({
    area: z.string(),
    name: z.string(),
    location: locationModel.shape.location.nullable(),
});

const modelShape = areaModel.shape;
export const areaCreate = areaModel
.extend({
    area: modelShape.area.min(3),
    name: modelShape.name.min(3),
});

export const areaUpdate = areaCreate.partial();

export type Area = z.infer<typeof areaModel>;
export type AreaCreate = z.infer<typeof areaCreate>;
export type AreaUpdate = z.infer<typeof areaUpdate>;