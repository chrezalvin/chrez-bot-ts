// session stores for server (cached)

import SessionStore from "@library/sessions";

export interface I_User{
    username: string;
    discordID: string;
    avatarURL?: string;
}

export function isUserSession(val: unknown): val is I_User{
    if(val === null || typeof val !== "object") return false;
    if(!("username" in val) || !("discordID" in val)) return false;

    return typeof val.username === "string" && typeof val.discordID === "string";
}

export const sessions = new SessionStore<I_User>();

export default sessions;