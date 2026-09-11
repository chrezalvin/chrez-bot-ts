import z from "zod";

export const elementWeaknessCreate = z.object({
    element: z.string().min(3),
    weakness: z.string().min(3),
});

export const elementWeaknessUpdate = elementWeaknessCreate.partial();

export type ElementWeaknessCreate = z.input<typeof elementWeaknessCreate>;
export type ElementWeaknessUpdate = z.input<typeof elementWeaknessUpdate>;