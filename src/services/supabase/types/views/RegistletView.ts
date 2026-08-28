import z from "zod";
import { stoodieModel } from "../models/Stoodie";
import { registletModel } from "../models/Registlet";
import { RegistletService } from "@services/supabase/services";

export const registletView = z.object({
    ...registletModel.extend({
        image: registletModel.shape.image.transform(img => img && RegistletService.fileUpload.translatePathToUrl(img))
    }).shape,
    stoodies: z.array(stoodieModel),
});

export type RegistletView = z.infer<typeof registletView>;