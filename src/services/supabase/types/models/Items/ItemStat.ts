import z from "zod";
import { itemModel } from "./Item";
import { statModel } from "../Stats";
import { statRestrictionModel } from "../Stats/StatRestriction";

export const itemStatModel = z.object({
    item: itemModel.shape.item,
    stat: statModel.shape.stat,
    restriction: statRestrictionModel.shape.stat_restriction,
    amount: z.number(),
});

export type ItemStat = z.infer<typeof itemStatModel>;