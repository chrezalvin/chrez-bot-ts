export interface DiscordUser {
    id:                   string;
    system:               boolean;
    username:             string;
    globalName:           null;
    discriminator:        string;
    avatar:               string;
    avatarDecoration:     null;
    avatarDecorationData: null;
    createdTimestamp:     number;
    defaultAvatarURL:     string;
    avatarURL:            string;
    displayAvatarURL:     string;
}

export function isDiscordUser(obj: unknown): obj is DiscordUser {
    if (typeof obj !== "object" || obj === null) return false;

    if (!("id" in obj) || typeof obj.id !== "string") return false;

    if (!("system" in obj) || typeof obj.system !== "boolean") return false;

    if (!("username" in obj) || typeof obj.username !== "string") return false;

    if (!("globalName" in obj) || obj.globalName !== null) return false;

    if (!("discriminator" in obj) || typeof obj.discriminator !== "string") return false;

    if (!("avatar" in obj) || typeof obj.avatar !== "string") return false;

    if (!("avatarDecoration" in obj) || obj.avatarDecoration !== null) return false;

    if (!("avatarDecorationData" in obj) || obj.avatarDecorationData !== null) return false;

    if (!("createdTimestamp" in obj) || typeof obj.createdTimestamp !== "number") return false;

    if (!("defaultAvatarURL" in obj) || typeof obj.defaultAvatarURL !== "string") return false;

    if (!("avatarURL" in obj) || typeof obj.avatarURL !== "string") return false;

    if (!("displayAvatarURL" in obj) || typeof obj.displayAvatarURL !== "string") return false;

    return true;
}