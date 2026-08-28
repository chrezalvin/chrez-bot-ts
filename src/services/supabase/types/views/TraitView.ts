import z from "zod";
import { traitModel } from "../models/Trait";

export const traitView = traitModel;

export type TraitView = z.infer<typeof traitView>;