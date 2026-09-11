import z from "zod";
import { stoodieModel } from "../models/Stoodie";
import { registletModel } from "../models/Registlet";
import { iconModel } from "../models/Icon";

export const registletView = z.object({
    ...registletModel.shape,
    stoodies: z.array(stoodieModel),
    icon: iconModel.nullable()
});

export type RegistletView = z.infer<typeof registletView>;