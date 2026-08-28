import z from "zod";

export const locationModel = z.object({
    location: z.string(),
    name: z.string()
});

const modelShape = locationModel.shape;
export const locationCreate = locationModel
.extend({
    location: modelShape.location.min(3),
    name: modelShape.name.min(3),
});

export const locationUpdate = locationCreate.partial();

export type Location = z.infer<typeof locationModel>;
export type LocationCreate = z.infer<typeof locationCreate>;
export type LocationUpdate = z.infer<typeof locationUpdate>;