import z from "zod";
import { iconCategoryModel } from "./IconCategory";
import { capitalize } from "@library/BasicFunctions";
import { FileUploadType } from "@library";

export const iconModel = z.object({
    icon: z.string(),
    category: iconCategoryModel.shape.icon_category,
    image: z.string(),
    name: z.string(),
    discord_emoji: z.string(),
});

const modelShape = iconModel.shape;
export const iconCreate = z.object({
    icon: iconModel.omit({
        image: true,
        name: true,
    }).extend({
        icon: modelShape.icon.min(2),
        category: modelShape.category.min(2),
    }).transform(arg => ({
        ...arg,
        name: capitalize(arg.icon.replace("_", " "))
    })),
    image: z.object({
        file: z.custom<FileUploadType>(),
        mimetype: z.string()
    })
});

export const iconUpdate = iconCreate.extend({
    icon: iconCreate.shape.icon.in.partial(),
    image: iconCreate.shape.image.optional()
});

export type Icon = z.infer<typeof iconModel>;
export type IconCreate = z.input<typeof iconCreate>;
export type IconUpdate = z.infer<typeof iconUpdate>;