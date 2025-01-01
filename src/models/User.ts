import { StrictOmit } from "@library/CustomTypes";

export type RoleName = "owner" | "vice" | "admin" | "user";

export interface User{
    user_id: string;
    username: string;
    timezone: string | null;
    aliases: string[] | null;
    role: RoleName;
}

export function isUser(value: unknown): value is User{
    if(value === null || typeof value !== "object")
        return false;

    if(!("user_id" in value) || typeof value.user_id !== "string")
        return false;

    if(!("username" in value) || typeof value.username !== "string")
        return false;

    if(!("timezone" in value) || (typeof value.timezone !== "string" && value.timezone !== null))
        return false;

    if(!("aliases" in value) || (!Array.isArray(value.aliases) && value.aliases !== null))
        return false;

    if(!("role" in value) || typeof value.role !== "string" || !["owner", "vice", "admin", "user"].includes(value.role))
        return false;


    return true;
}

export function isUserWithoutId(value: unknown): value is StrictOmit<User, "user_id">{
    if(value === null || typeof value !== "object")
        return false;

    if("user_id" in value)
        return false;

    if("username" in value && typeof value.username !== "string")
        return false;

    if("timezone" in value && (typeof value.timezone !== "string" && value.timezone !== null))
        return false;

    if("aliases" in value && (!Array.isArray(value.aliases) && value.aliases !== null))
        return false;

    if("role" in value && (typeof value.role !== "string" || !["owner", "vice", "admin", "user"].includes(value.role)))
        return false;

    return true;
}

export function isPartialUser(value: unknown): value is Partial<User>{
    if(value === null || typeof value !== "object")
        return false;

    if("user_id" in value && typeof value.user_id !== "string")
        return false;

    if("username" in value && typeof value.username !== "string")
        return false;

    if("timezone" in value && (typeof value.timezone !== "string" && value.timezone !== null))
        return false;

    if("aliases" in value && (!Array.isArray(value.aliases) && value.aliases !== null))
        return false;

    if("role" in value && (typeof value.role !== "string" || !["owner", "vice", "admin", "user"].includes(value.role)))
        return false;

    return true;
}