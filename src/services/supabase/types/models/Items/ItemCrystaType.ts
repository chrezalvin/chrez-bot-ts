import z from "zod";
import { iconModel } from "../Icon";

export const itemCrystaTypeModel = z.object({
    crysta_type: z.string(),
    name: z.string(),
    icon: iconModel.shape.icon,
    icon_highlighted: iconModel.shape.icon,
});

export type ItemCrystaType = z.infer<typeof itemCrystaTypeModel>;