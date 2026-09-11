import z from "zod";
import { countryModel } from "./Country";

export const timezoneModel = z.object({
    timezone: z.string(),
    city: z.string(),
    country: countryModel.shape.country.nullable(),
});

export type Timezone = z.infer<typeof timezoneModel>;