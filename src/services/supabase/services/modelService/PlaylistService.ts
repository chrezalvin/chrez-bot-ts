import { supabaseModels } from "@shared/supabase";
import { Playlist, PlaylistCreate, PlaylistUpdate } from "../../types/models/Playlist";

export const tableName = "playlists";

export async function createPlaylist(schema: PlaylistCreate): Promise<Playlist>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updatePlaylist(
    playlist: Playlist["playlist_id"], 
    schema: PlaylistUpdate, 
): Promise<Playlist>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
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