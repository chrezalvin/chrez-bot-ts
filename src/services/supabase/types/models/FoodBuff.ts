import z from "zod";
import { statModel } from "./Stats/Stat";
import { FileUpload } from "@library";
import { supabaseModels } from "@shared/supabase";

export const foodBuffFileUploader = new FileUpload("foods", supabaseModels);

export const foodBuffModel = z.object({
    food_buff: z.string(),
    name: z.string(),
    stat: statModel.shape.stat.nullable(),
    stat_growth: z.array(z.number()),
    ingredient_cost: z.number(),
    image: z.string().nullable().transform(img => {
        if(img)
            return foodBuffFileUploader.translatePathToUrl(img);
        return null;
    }),
    aliases: z.string().array()
});

export type FoodBuff = z.infer<typeof foodBuffModel>;