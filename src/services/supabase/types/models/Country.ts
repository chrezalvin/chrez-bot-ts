import z from "zod";

export const countryModel = z.object({
    country: z.string(),
    name: z.string(),
    code: z.string(),
    flag: z.string().nullable()
});

export type Country = z.infer<typeof countryModel>;