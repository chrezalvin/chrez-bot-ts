import z from "zod";
import { discordUserModel } from "./DiscordUser";

export const playlistModel = z.object({
    playlist_id: z.number(),
    user: discordUserModel.shape.user_id,
    link_list: z.array(z.url()),
    name: z.string()
});

export type Playlist = z.infer<typeof playlistModel>;