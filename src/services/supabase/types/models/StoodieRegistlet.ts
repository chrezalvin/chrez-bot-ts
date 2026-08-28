import z from "zod";
import { stoodieModel } from "./Stoodie";
import { registletModel } from "./Registlet";

export const stoodieRegistletModel = z.object({
    stoodie: stoodieModel.shape.stoodie,
    registlet: registletModel.shape.registlet
});

const modelShape = stoodieRegistletModel.shape;
export const stoodieRegistletCreate = stoodieRegistletModel
.extend({
    stoodie: modelShape.stoodie,
    registlet: modelShape.registlet
});

export const stoodieRegistletUpdate = stoodieRegistletCreate.partial();

export type StoodieRegistlet = z.infer<typeof stoodieRegistletModel>;
export type StoodieRegistletCreate = z.infer<typeof stoodieRegistletCreate>;
export type StoodieRegistletUpdate = z.infer<typeof stoodieRegistletUpdate>;