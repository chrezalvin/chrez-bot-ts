import { ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { Playlist, isPlaylist } from "@models";
import { supabase } from "@shared/supabase";

export class PlaylistService{
    protected static readonly playlistPath = "playlist";

    static playlistSupabase = new ServiceFileSupabase<Playlist, "playlist_id">(
        supabase,
        "playlist_id", {
        tableName: PlaylistService.playlistPath,
        typeGuard: isPlaylist,
        useCache: true,
    });

    static getPlaylist(){
        return PlaylistService.playlistSupabase.cache;
    }

    static async getPlaylistByNameAndUser(playlistName: string, user: string): Promise<Playlist | undefined>{
        const res = await PlaylistService.playlistSupabase.queryBuilder((query) => query
            .eq("name", playlistName)
            .eq("user", user)
            .limit(1)
        );

        if(!Array.isArray(res))
            throw new Error("Failed to get playlist");

        return res[0];
    }

    static async getPlaylistByUser(user: string): Promise<Playlist[]>{
        const res = await PlaylistService.playlistSupabase.queryBuilder((query) => query
            .eq("user", user)
            .order("name", { ascending: true })
        );

        if(!Array.isArray(res))
            throw new Error("Failed to get playlist");

        return res;
    }

    static async setNewPlaylist(playlist: StrictOmit<Playlist, "playlist_id">){
        return PlaylistService.playlistSupabase.add(playlist);
    }

    static async updatePlaylist(playlistId: Playlist["playlist_id"], playlist: Partial<StrictOmit<Playlist, "playlist_id">>){
        return await PlaylistService.playlistSupabase.update(playlistId, playlist);
    }

    static async deletePlaylistById(playlistId: Playlist["playlist_id"]){
        return await PlaylistService.playlistSupabase.delete(playlistId);
    }
}

export default PlaylistService;