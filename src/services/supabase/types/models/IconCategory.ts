import z from "zod";

export const iconCategoryModel = z.object({
    icon_category: z.string(),
    name: z.string()
});

const modelShape = iconCategoryModel.shape;
export const iconCategoryCreate = iconCategoryModel.extend({
    icon_category: modelShape.icon_category.min(3),
    name: modelShape.name.min(3),
});

export const iconCategoryUpdate = iconCategoryCreate.partial();

export type IconCategory = z.infer<typeof iconCategoryModel>;
export type IconCategoryCreate = z.infer<typeof iconCategoryCreate>;
export type IconCategoryUpdate = z.infer<typeof iconCategoryUpdate>;