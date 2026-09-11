import z from "zod";

export const discordUserCreate = z.object({
    user_id: z.string().min(3),
    username: z.string().min(3),
    timezone: z.string().min(3).nullable().optional(),
    aliases: z.string().min(3).array().min(1).nullable().optional(),
    birthday: z.string().min(3).nullable().optional(),
    role: z.string().min(3).nullable().optional(),
});

export const discordUserUpdate = discordUserCreate.partial();

export type DiscordUserCreate = z.input<typeof discordUserCreate>;
export type DiscordUserUpdate = z.input<typeof discordUserUpdate>;