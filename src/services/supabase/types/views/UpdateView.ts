import z from "zod";
import { updateModel } from "../models/Update";

export const updateView = updateModel;

export type UpdateView = z.infer<typeof updateView>;