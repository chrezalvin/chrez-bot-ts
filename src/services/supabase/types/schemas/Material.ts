import z from "zod";

export const materialCreate = z.object({
    material: z.string().min(3),
    name: z.string().min(3),
    material_point: z.number().min(0),
    material_type: z.string().optional(),
});

export const materialUpdate = materialCreate.partial();

export type MaterialCreate = z.input<typeof materialCreate>;
export type MaterialUpdate = z.input<typeof materialUpdate>;