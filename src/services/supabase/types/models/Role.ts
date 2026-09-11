import z from "zod";

export const roleModel = z.object({
    role: z.string(),
    name: z.string(),
    description: z.string().nullable(),
});

export type Role = z.infer<typeof roleModel>;