import z from "zod";

export const timezoneCreate = z.object({
    timezone: z.string().min(3),
    city: z.string().min(3),
    country: z.string().nullable().optional()
});

export const timezoneUpdate = timezoneCreate.partial();

export type TimezoneCreate = z.input<typeof timezoneCreate>;
export type TimezoneUpdate = z.input<typeof timezoneUpdate>;