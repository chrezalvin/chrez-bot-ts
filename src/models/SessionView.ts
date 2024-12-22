import { isUser, isUserWithoutId, User } from "./User";

// using type union to prevent duck typing
export type SessionView = Omit<User, "id"> & {
    id: string;
    user_id: string;
    ends_at: string;
    avatar_url: string | null;
}

export function isSessionView(value: unknown): value is SessionView{
    if(!isUser(value))
        return false;

    if(!("ends_at" in value) || typeof value.ends_at !== "string")
        return false;

    if(!("user_id" in value) || typeof value.user_id !== "string")
        return false;

    if(("avatar_url" in value) && typeof value.avatar_url !== "string")
        return false;

    return true;
}

export function isSessionViewWithoutId(value: unknown): value is Omit<SessionView, "id">{
    if(!isUserWithoutId(value))
        return false;

    if("ends_at" in value && typeof value.ends_at !== "string")
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("avatar_url" in value && typeof value.avatar_url !== "string")
        return false;

    return true;
}

export function isPartialSessionView(value: unknown): value is Partial<SessionView>{
    if(!isUser(value))
        return false;

    if("ends_at" in value && typeof value.ends_at !== "string")
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("avatar_url" in value && typeof value.avatar_url !== "string")
        return false;

    return true;
}