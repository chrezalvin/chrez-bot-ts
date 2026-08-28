import z from "zod";

export const countryModel = z.object({
    country: z.string(),
    name: z.string(),
    code: z.string(),
    flag: z.string().nullable()
});

const modelShape = countryModel.shape;
export const countryCreate = z.object({
    country: countryModel.omit({
        flag: true,
    }).extend({
        country: modelShape.country.min(3),
        name: modelShape.name.min(3),
        code: modelShape.code.min(1)
    }),
    image: z.custom<Blob>().nullable().optional(),
});

export const countryUpdate = countryCreate.extend({
    country: countryCreate.shape.country.partial(),
    image: countryCreate.shape.image.optional()
});

export type Country = z.infer<typeof countryModel>;
export type CountryCreate = z.infer<typeof countryCreate>;
export type CountryUpdate = z.infer<typeof countryUpdate>;