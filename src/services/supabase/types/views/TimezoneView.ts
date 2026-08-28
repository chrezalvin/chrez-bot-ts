import z from "zod";
import { timezoneModel } from "../models/Timezone";
import { countryModel } from "../models/Country";
import { CountryService } from "@services/supabase/services";

export const timezoneView = timezoneModel.pick({
    timezone: true,
}).extend({
    country: countryModel.pick({
        name: true,
        flag: true
    }).extend({
        flag: countryModel.shape.flag.transform((flag) => flag ? CountryService.fileUpload.translatePathToUrl(flag) : null)
    }).nullable()
});

export type TimezoneView = z.infer<typeof timezoneView>;