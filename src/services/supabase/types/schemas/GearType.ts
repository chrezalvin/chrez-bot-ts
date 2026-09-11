import z from "zod";

export const gearTypeCreate = z.object({
    gear_type: z.string().min(3),
    gear_name: z.string().min(3),
    aliases: z.string().min(3).array().nullable().optional(),
    icon: z.string().min(3),
});

export const gearTypeUpdate = gearTypeCreate.partial();

export type GearTypeCreate = z.input<typeof gearTypeCreate>;
export type GearTypeUpdate = z.input<typeof gearTypeUpdate>;