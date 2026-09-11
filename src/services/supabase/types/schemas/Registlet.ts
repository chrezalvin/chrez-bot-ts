import z from "zod";

export const registletCreate = z.object({
    registlet: z.string().min(3),
    name: z.string().min(3),
    description: z.string().min(3).nullable().optional(),
    max_level: z.number().min(1).max(999),
    upgrade_cost: z.number().min(0).nullable().optional()
});

export const registletUpdate = registletCreate.partial();

export type RegistletCreate = z.input<typeof registletCreate>;
export type RegistletUpdate = z.input<typeof registletUpdate>;