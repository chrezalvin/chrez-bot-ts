import z from "zod";

export const locationCreate = z.object({
    location: z.string().min(3),
    name: z.string().min(3),
});

export const locationUpdate = locationCreate.partial();

export type LocationCreate = z.input<typeof locationCreate>;
export type LocationUpdate = z.input<typeof locationUpdate>;