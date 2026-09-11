import z from "zod";

export const iconCategoryModel = z.object({
    icon_category: z.string(),
    name: z.string()
});

export type IconCategory = z.infer<typeof iconCategoryModel>;