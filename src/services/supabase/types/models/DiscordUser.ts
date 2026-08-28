import z from "zod";
import { timezoneModel } from "./Timezone";
import { roleModel } from "./Role";
import { toramUserModel } from "./ToramUser";

export const discordUserModel = z.object({
    user_id: z.string(),
    username: z.string(),
    timezone: timezoneModel.shape.timezone.nullable(), 
    aliases: z.array(z.string()).nullable(),
    birthday: z.string().nullable(),
    role: roleModel.shape.role.nullable()
});

const modelShape = discordUserModel.shape;
export const discordUserCreate = discordUserModel.extend({
    user_id: modelShape.user_id,
    username: modelShape.username,
    timezone: modelShape.timezone.optional(),
    aliases: modelShape.aliases.optional(),
    birthday: modelShape.birthday.optional(),
    role: modelShape.role.optional(),
});

export const discordUserUpdate = discordUserCreate.partial();

export type DiscordUser = z.infer<typeof discordUserModel>;
export type DiscordUserCreate = z.infer<typeof discordUserCreate>;
export type DiscordUserUpdate = z.infer<typeof discordUserUpdate>;