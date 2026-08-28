import { supabaseModels } from "@shared/supabase";
import { DiscordUser, DiscordUserCreate, DiscordUserUpdate } from "../../types/models/DiscordUser";

export const tableName = "discord_users";

export async function get(userId: DiscordUser["user_id"]): Promise<DiscordUser>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("user_id", userId)
        .single()
        .throwOnError();

    return data!;
}

export async function createDiscordUser(schema: DiscordUserCreate): Promise<DiscordUser>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateDiscordUser(
    userId: DiscordUser["user_id"], 
    schema: DiscordUserUpdate, 
): Promise<DiscordUser>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("user_id", userId)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteDiscordUser(user_id: DiscordUser["user_id"]): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("user_id", user_id)
        .throwOnError();

    return true;
}