import { DiscordUserView } from "@services/supabase/types/views/DiscordUserView";
import { DiscordUserViewService } from "../viewService";
import { DiscordUserService } from "../modelService";
import { DiscordUserCreate, DiscordUserUpdate } from "@services/supabase/types/models/DiscordUser";

const cache = new Map<DiscordUserView["user_id"], DiscordUserView>();

export async function getDiscordUser(user_id: DiscordUserView["user_id"]): Promise<DiscordUserView | null>{
    if(cache.has(user_id))
        return cache.get(user_id)!;

    const discordUser = await DiscordUserViewService.getDiscordUser(user_id);

    return discordUser;
}

export async function updateDiscordUser(user_id: DiscordUserView["user_id"], update: DiscordUserUpdate): Promise<DiscordUserView>{
    const existingUser = await DiscordUserViewService.getDiscordUser(user_id);

    if(!existingUser)
        throw new Error("user not found!");

    await DiscordUserService.updateDiscordUser(user_id, update);

    const updatedDiscordUser = await DiscordUserViewService.getDiscordUser(user_id);

    if(!updatedDiscordUser)
        throw new Error("Updated user not found!");

    cache.set(user_id, updatedDiscordUser);

    return updatedDiscordUser;
}

export async function createDiscordUser(user_id: DiscordUserView["user_id"], discordUser: DiscordUserCreate): Promise<DiscordUserView>{
    const found = await DiscordUserViewService.getDiscordUser(user_id);

    if(found)
        throw new Error("user already exist!");

    await DiscordUserService.createDiscordUser(discordUser);

    const createdUser = await DiscordUserViewService.getDiscordUser(user_id);

    if(!createdUser)
        throw new Error("Created user not found!");

    cache.set(user_id, createdUser);

    return createdUser;
}

export async function deleteDiscordUser(user_id: DiscordUserView["user_id"]): Promise<true>{
    const found = await DiscordUserViewService.getDiscordUser(user_id);

    if(!found)
        throw new Error("User not found!");

    await DiscordUserService.deleteDiscordUser(user_id);

    cache.delete(user_id);

    return true;
}