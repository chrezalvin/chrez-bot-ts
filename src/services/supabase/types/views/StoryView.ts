import z from "zod";
import { storyModel } from "../models/Story";

export const storyView = storyModel;

export type StoryView = z.infer<typeof storyView>;