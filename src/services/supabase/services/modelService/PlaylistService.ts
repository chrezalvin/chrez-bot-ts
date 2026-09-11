import { supabaseModels } from "@shared/supabase";
import { Playlist, playlistCreate, PlaylistCreate, playlistUpdate, PlaylistUpdate } from "@services/supabase/types";

export const tableName = "playlists";

export async function createPlaylist(schema: PlaylistCreate): Promise<Playlist>{
    const parsed = playlistCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updatePlaylist(
    playlist: Playlist["playlist_id"], 
    schema: PlaylistUpdate, 
): Promise<Playlist>{
    const parsed = playlistUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
        .eq("playlist_id", playlist)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deletePlaylist(
    playlist: Playlist["playlist_id"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("playlist_id", playlist)
        .throwOnError();

    return true;
}