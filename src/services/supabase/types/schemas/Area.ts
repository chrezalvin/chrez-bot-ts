import z from "zod";

export const areaCreate = z.object({
    area: z.string().min(3),
    name: z.string().min(3),
});

export const areaUpdate = areaCreate.partial();

export type AreaCreate = z.input<typeof areaCreate>;
export type AreaUpdate = z.input<typeof areaUpdate>;