import profiles from "@assets/data/profiles.json";

export interface Profile{
    discordID: string;
    name: string;
    avatarID: null | string;
    birthday: null | {day: number, month: number, year: number | null};
    alias: string[];
    timezone?: string;
    isAdmin?: boolean;
}

/**
 * get a guild member by id, alot faster than by name
 * @param discordID user's discord ID
 * @returns Profile or null
 */
export function getProfileByID(discordID: string): Profile | null{
    const find = profiles.find(profile => discordID === profile.discordID) ?? null;
    return find;
}

/**
 * get a guild member by name or their aliases (slower than get by ID)
 * @param discordID user's name or alias (case insensitive)
 * @returns Profile or null
 */
export function getProfileByName(name: string): Profile | null{
    const find = profiles.find(
        profile => (profile.name === name.toLowerCase() || profile.alias.find( a => a === name.toLowerCase()))
                ) ?? null;
    return find;
}

export function userIsAdmin(discordID: string): boolean{
    const find = getProfileByID(discordID);
    if(find)
        return find.isAdmin === true;
    return false;
}