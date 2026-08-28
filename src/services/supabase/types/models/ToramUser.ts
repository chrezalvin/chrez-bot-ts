import z from "zod";
import { discordUserModel } from "./DiscordUser";

export const toramUserModel = z.object({
    toram_user: z.string(),
    land_address: z.string().nullable(),
    updated_at: z.string().nullable(),
    discord_user: discordUserModel.shape.user_id.nullable(),
});

const modelShape = toramUserModel.shape;
export const toramUserCreate = toramUserModel.extend({
    toram_user: modelShape.toram_user.min(3),
    land_address: modelShape.land_address.optional(),
    discord_user: modelShape.discord_user.optional(),
});

export const toramUserUpdate = toramUserCreate.partial();

export type ToramUser = z.infer<typeof toramUserModel>;
export type ToramUserCreate = z.infer<typeof toramUserCreate>;
export type ToramUserUpdate = z.infer<typeof toramUserUpdate>;