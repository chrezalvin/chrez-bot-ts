import z from "zod";

export const countryCreate = z.object({
    country: z.object({
        country: z.string().min(3),
        name: z.string().min(3),
        code: z.string().min(1)
    }),
    image: z.custom<Blob>().nullable().optional(),
});

export const countryUpdate = countryCreate.extend({
    country: countryCreate.shape.country.partial(),
    image: countryCreate.shape.image.optional()
});

export type CountryCreate = z.input<typeof countryCreate>;
export type CountryUpdate = z.input<typeof countryUpdate>;