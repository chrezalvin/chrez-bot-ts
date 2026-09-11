import z from "zod";
import { iconModel } from "./Icon";

export const ailmentModel = z.object({
    ailment: z.string(),
    name: z.string(),
    icon: iconModel.shape.icon.nullable(),
});

export type Ailment = z.infer<typeof ailmentModel>;