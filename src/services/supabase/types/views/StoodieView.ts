import z from "zod";
import { stoodieModel } from "../models/Stoodie";
import { registletModel } from "../models/Registlet";

export const stoodieView = z.object({
    ...stoodieModel.shape,
    registlets: z.array(
        z.object({
            ...registletModel.shape
        })
    ),
});

export type StoodieView = z.infer<typeof stoodieView>;