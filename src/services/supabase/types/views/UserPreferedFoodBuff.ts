import z from "zod";
import { discordUserModel } from "../models/DiscordUser";
import { foodBuffModel } from "../models/FoodBuff";
import { statModel } from "../models/Stat/Stat";
import { toramUserFoodBuffModel } from "../models/ToramUserFoodBuff";
import { toramUserModel } from "../models/ToramUser";

export const userPreferedFoodBuffView = z.object({
    discord_user: discordUserModel.shape.user_id,
    food_buff: foodBuffModel.pick({
        name: true,
    }).extend({
        stat: statModel.pick({
            stat: true,
            stat_name: true,
        }),
        toram_user_food_buffs: toramUserFoodBuffModel.pick({
            level: true,
        }).extend({
            toram_user: toramUserModel.pick({
                land_address: true,
                toram_user: true,
                updated_at: true,
            }).extend({
                discord_user: discordUserModel.pick({
                    user_id: true,
                    username: true,
                }).nullable()
            })
        }).array()
    })
});

export type UserPreferedFoodBuffView = z.infer<typeof userPreferedFoodBuffView>;