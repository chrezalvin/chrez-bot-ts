import z from "zod";
import { foodBuffModel } from "../models/FoodBuff";
import { statModel } from "../models/Stat/Stat";
import { toramUserFoodBuffModel } from "../models/ToramUserFoodBuff";
import { toramUserModel } from "../models/ToramUser";
import { discordUserModel } from "../models/DiscordUser";

export const toramUserFoodBuffView = foodBuffModel
.pick({
    name: true,
    image: true
}).extend({
    stat: statModel.pick({
        stat: true,
        stat_name: true,
    }),
    aliases: foodBuffModel.shape.aliases,
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
    stat: statModel.pick({
        stat: true,
        stat_name: true
    })
});

export type FoodBuffView = z.infer<typeof foodBuffView>;