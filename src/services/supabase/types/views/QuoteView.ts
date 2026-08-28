import z from "zod";
import { quoteModel } from "../models/Quote";

export const quoteView = quoteModel;

export type QuoteView = z.infer<typeof quoteView>;