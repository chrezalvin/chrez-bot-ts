export interface Session{
    id: string;
    user_id: string;
    ends_at: string;
    avatar_url: string | null;
}

export function isSession(value: unknown): value is Session{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("user_id" in value) || typeof value.user_id !== "string")
        return false;

    if(!("ends_at" in value) || typeof value.ends_at !== "string")
        return false;

    if(("avatar_url" in value) && typeof value.avatar_url !== "string")
        return false;

    return true;
}

export function isSessionWithoutId(value: unknown): value is Omit<Session, "id">{
    if(typeof value !== "object" || value === null)
        return false;

    if("id" in value)
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("ends_at" in value && typeof value.ends_at !== "string")
        return false;

    if("avatar_url" in value && typeof value.avatar_url !== "string")
        return false;

    return true;
}

export function isPartialSession(value: unknown): value is Partial<Session>{
    if(typeof value !== "object" || value === null)
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("ends_at" in value && typeof value.ends_at !== "string")
        return false;

    if("avatar_url" in value && typeof value.avatar_url !== "string")
        return false;

    return true;
}