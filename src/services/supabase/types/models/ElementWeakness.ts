import z from "zod";
import { elementCreate, elementModel } from "./Element";

export const elementWeaknessModel = z.object({
    element: elementModel.shape.element,
    weakness: elementModel.shape.element,
});

export const elementWeaknessCreate = elementWeaknessModel
.extend({
    element: elementCreate.shape.element,
    weakness: elementCreate.shape.element,
});

export const elementWeaknessUpdate = elementWeaknessCreate.partial();

export type ElementWeakness = z.infer<typeof elementWeaknessModel>;
export type ElementWeaknessCreate = z.infer<typeof elementWeaknessCreate>;
export type ElementWeaknessUpdate = z.infer<typeof elementWeaknessUpdate>;