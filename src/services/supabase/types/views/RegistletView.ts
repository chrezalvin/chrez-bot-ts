import z from "zod";
import { stoodieModel } from "../models/Stoodie";
import { registletModel } from "../models/Registlet";
import { IconService } from "@services/supabase/services";
import { iconModel } from "../models/Icon";

export const registletView = z.object({
    ...registletModel.shape,
    stoodies: z.array(stoodieModel),
    icon: iconModel.extend({
        image: iconModel.shape.image.transform(img => img && IconService.fileUpload.translatePathToUrl(img))
    }).nullable()
});

export type RegistletView = z.infer<typeof registletView>;