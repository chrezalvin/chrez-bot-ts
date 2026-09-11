import z from "zod";
import { FileUploadType } from "@library";

export const iconCreate = z.object({
    icon: z.object({
        category: z.string().min(3),
        name: z.string().min(3),
        discord_emoji: z.string().min(3),
    }).transform((icon) => ({
        ...icon,
        icon: (icon.category + '_' + icon.name).toLowerCase().replaceAll(" ", "_")
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

export type IconCreate = z.input<typeof iconCreate>;
export type IconUpdate = z.input<typeof iconUpdate>;