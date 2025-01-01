import { StrictOmit } from "@library/CustomTypes";

export interface Session{
    session_id: string;
    user_id: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export function isSession(value: unknown): value is Session{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("session_id" in value) || typeof value.session_id !== "string")
        return false;

    if(!("user_id" in value) || typeof value.user_id !== "string")
        return false;

    if(("avatar_url" in value) && typeof value.avatar_url !== "string")
        return false;

    if(!("created_at" in value) || typeof value.created_at !== "string")
        return false;

    if(!("updated_at" in value) || typeof value.updated_at !== "string")
        return false;

    return true;
}

export function isSessionWithoutId(value: unknown): value is StrictOmit<Session, "session_id">{
    if(typeof value !== "object" || value === null)
        return false;

    if("session_id" in value)
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("avatar_url" in value && typeof value.avatar_url !== "string")
        return false;

    if("created_at" in value && typeof value.created_at !== "string")
        return false;

    if("updated_at" in value && typeof value.updated_at !== "string")
        return false;

    return true;
}

export function isPartialSession(value: unknown): value is Partial<Session>{
    if(typeof value !== "object" || value === null)
        return false;

    if("session_id" in value && typeof value.session_id !== "string")
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("avatar_url" in value && typeof value.avatar_url !== "string")
        return false;

    if("created_at" in value && typeof value.created_at !== "string")
        return false;

    if("updated_at" in value && typeof value.updated_at !== "string")
        return false;

    return true;
}