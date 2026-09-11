import { supabaseModels } from "@shared/supabase";
import { DiscordUser, discordUserCreate, DiscordUserCreate, discordUserUpdate, DiscordUserUpdate } from "@services/supabase/types";

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
    const parsed = discordUserCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateDiscordUser(
    userId: DiscordUser["user_id"], 
    schema: DiscordUserUpdate, 
): Promise<DiscordUser>{
    const parsed = discordUserUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
        .eq("user_id", userId)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteDiscordUser(userId: DiscordUser["user_id"]): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("user_id", userId)
        .throwOnError();

    return true;
}