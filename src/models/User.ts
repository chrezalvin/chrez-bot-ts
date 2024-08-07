export type RoleName = "owner" | "vice" | "admin" | "user";

export interface User{
    id: string;
    username: string;
    timezone: string | null;
    aliases: string[] | null;
    rolename: RoleName;
}

export function isUser(value: unknown): value is User{
    if(value === null || typeof value !== "object")
        return false;

    if(!("id" in value) || typeof value.id !== "string")
        return false;

    if(!("username" in value) || typeof value.username !== "string")
        return false;

    if(!("timezone" in value) || (typeof value.timezone !== "string" && value.timezone !== null))
        return false;

    if(!("aliases" in value) || (!Array.isArray(value.aliases) && value.aliases !== null))
        return false;

    if(!("rolename" in value) || typeof value.rolename !== "string" || !["owner", "vice", "admin", "user"].includes(value.rolename))
        return false;


    return true;
}