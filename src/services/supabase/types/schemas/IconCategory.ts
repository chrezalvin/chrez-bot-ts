import z from "zod";

export const iconCategoryCreate = z.object({
    icon_category: z.string().min(3),
    name: z.string().min(3),
});

export const iconCategoryUpdate = iconCategoryCreate.partial();

export type IconCategoryCreate = z.input<typeof iconCategoryCreate>;
export type IconCategoryUpdate = z.input<typeof iconCategoryUpdate>;