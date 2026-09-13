import z from "zod";
import { iconModel } from "../Icon";

export const itemModel = z.object({
    item: z.string(),
    name: z.string(),
    icon: iconModel.shape.icon.nullable(),
    description: z.string().nullable(),
    is_verified: z.boolean(),
});

export type Item = z.infer<typeof itemModel>;