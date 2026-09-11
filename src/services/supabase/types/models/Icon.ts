import z from "zod";
import { iconCategoryModel } from "./IconCategory";
import { FileUpload } from "@library";
import { supabaseModels } from "@shared/supabase";

export const iconFileUploader = new FileUpload("icons", supabaseModels);

export const iconModel = z.object({
    icon: z.string(),
    category: iconCategoryModel.shape.icon_category,
    image: z.string().transform(img => {
        return iconFileUploader.translatePathToUrl(img)
    }),
    name: z.string(),
    discord_emoji: z.string(),
});

export type Icon = z.infer<typeof iconModel>;