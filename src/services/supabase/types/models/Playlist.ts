import z from "zod";
import { discordUserModel } from "./DiscordUser";

export const playlistModel = z.object({
    playlist_id: z.number(),
    user: discordUserModel.shape.user_id,
    link_list: z.array(z.url()),
    name: z.string()
});

const modelShape = playlistModel.shape;
export const playlistCreate = playlistModel
.extend({
    user: modelShape.user,
    link_list: modelShape.link_list.min(2),
    name: modelShape.name.min(3)
});

export const playlistUpdate = playlistCreate.partial();

export type Playlist = z.infer<typeof playlistModel>;
export type PlaylistCreate = z.infer<typeof playlistCreate>;
export type PlaylistUpdate = z.infer<typeof playlistUpdate>;