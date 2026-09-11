import z from "zod";
import { discordUserModel } from "./DiscordUser";

export const toramUserModel = z.object({
    toram_user: z.string(),
    land_address: z.string().nullable(),
    updated_at: z.string().nullable(),
    discord_user: discordUserModel.shape.user_id.nullable(),
});

export type ToramUser = z.infer<typeof toramUserModel>;