import z from "zod";

export const materialTypeCreate = z.object({
    material_type: z.string().min(3),
    name: z.string().min(3),
    icon: z.string().min(3).nullable().optional(),
});

export const materialTypeUpdate = materialTypeCreate.partial();

export type MaterialTypeCreate = z.input<typeof materialTypeCreate>;
export type MaterialTypeUpdate = z.input<typeof materialTypeUpdate>;