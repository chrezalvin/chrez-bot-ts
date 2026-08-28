import z from "zod";
import { foodBuffModel } from "../models/FoodBuff";
import { statModel } from "../models/Stat";
import { toramUserFoodBuffModel } from "../models/ToramUserFoodBuff";
import { toramUserModel } from "../models/ToramUser";
import { discordUserModel } from "../models/DiscordUser";
import { FoodBuffService } from "@services/supabase/services";

export const toramUserFoodBuffView = z.object({
    name: foodBuffModel.shape.name,
    image: foodBuffModel.shape.image.transform(img => img ? FoodBuffService.fileUpload.translatePathToUrl(img) : null),
    stat: statModel,
    toram_user_food_buffs: z.array(
        z.object({
            level: toramUserFoodBuffModel.shape.level,
            toram_user: toramUserModel.pick({
                land_address: true,
                toram_user: true,
                updated_at: true,
            }).extend({
                discord_user: discordUserModel.pick({
                    user_id: true,
                    username: true
                }).nullable()
            })
        })
    )
});

export type ToramUserFoodBuffView = z.infer<typeof toramUserFoodBuffView>;

export const foodBuffView = foodBuffModel.extend({
    stat: statModel
});

export type FoodBuffView = z.infer<typeof foodBuffView>;