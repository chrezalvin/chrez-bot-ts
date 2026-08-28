import z from "zod";
import { countryCreate, countryModel } from "./Country";

export const timezoneModel = z.object({
    timezone: z.string(),
    city: z.string(),
    country: countryModel.shape.country.nullable(),
});

const modelShape = timezoneModel.shape;
export const timezoneCreate = timezoneModel.extend({
    timezone: modelShape.timezone.min(3),
    city: modelShape.city.min(3),
    country: modelShape.country.optional()
});

export const timezoneUpdate = timezoneCreate.partial();

export type Timezone = z.infer<typeof timezoneModel>;
export type TimezoneCreate = z.infer<typeof timezoneCreate>;
export type TimezoneUpdate = z.infer<typeof timezoneUpdate>;