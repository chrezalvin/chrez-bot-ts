import z from "zod";
import { elementModel } from "./Element";

export const elementWeaknessModel = z.object({
    element: elementModel.shape.element,
    weakness: elementModel.shape.element,
});

export type ElementWeakness = z.infer<typeof elementWeaknessModel>;