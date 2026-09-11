import z from "zod";

export const roleCreate = z.object({
    role: z.string().min(3),
    name: z.string().min(3),
    description: z.string().min(3).nullable().optional()
});

export const roleUpdate = roleCreate.partial();

export type RoleCreate = z.input<typeof roleCreate>;
export type RoleUpdate = z.input<typeof roleUpdate>;