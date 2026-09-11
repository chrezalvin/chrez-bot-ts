import z from "zod";
import { stoodieModel } from "./Stoodie";
import { registletModel } from "./Registlet";

export const stoodieRegistletModel = z.object({
    stoodie: stoodieModel.shape.stoodie,
    registlet: registletModel.shape.registlet
});

export type StoodieRegistlet = z.infer<typeof stoodieRegistletModel>;