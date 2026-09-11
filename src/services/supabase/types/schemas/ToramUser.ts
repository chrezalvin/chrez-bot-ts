import z from "zod";

export const toramUserCreate = z.object({
    toram_user: z.string().min(3),
    land_address: z.string().nullable().optional(),
    discord_user: z.string().nullable().optional(),
});

export const toramUserUpdate = toramUserCreate.partial();

export type ToramUserCreate = z.input<typeof toramUserCreate>;
export type ToramUserUpdate = z.input<typeof toramUserUpdate>;