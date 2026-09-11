import z from "zod";

export const playlistCreate = z.object({
    user: z.string(),
    link_list: z.url().array().min(2),
    name: z.string().min(3)
});

export const playlistUpdate = playlistCreate.partial();

export type PlaylistCreate = z.input<typeof playlistCreate>;
export type PlaylistUpdate = z.input<typeof playlistUpdate>;