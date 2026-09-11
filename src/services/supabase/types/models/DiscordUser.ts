import z from "zod";
import { timezoneModel } from "./Timezone";
import { roleModel } from "./Role";

export const discordUserModel = z.object({
    user_id: z.string(),
    username: z.string(),
    timezone: timezoneModel.shape.timezone.nullable(), 
    aliases: z.array(z.string()).nullable(),
    birthday: z.string().nullable(),
    role: roleModel.shape.role.nullable()
});

export type DiscordUser = z.infer<typeof discordUserModel>;