import z from "zod";
import { iconModel } from "../Icon";

export const itemChestModel = z.object({
    item: z.string(),
    icon: iconModel.shape.icon,
});

export type ItemChest = z.infer<typeof itemChestModel>;