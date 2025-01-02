const debug = require("debug")("discord-yt-player");
import DiscordYtPlayer from "@library/DiscordYtPlayer";

export const discordYtPlayerMap = new Map<string, DiscordYtPlayer>();

export function createDiscordYtPlayerIfNotExist(guildId: string): DiscordYtPlayer{
    for(const [key, value] of discordYtPlayerMap){
        if(key === guildId){
            debug(`DiscordYtPlayer already exist for guild ${guildId}, returning the existing one`);
            return value;
        }
    }

    const discordYtPlayer = new DiscordYtPlayer();
    discordYtPlayerMap.set(guildId, discordYtPlayer);

    return discordYtPlayer;
}

export function getDiscordYtPlayer(guildId: string): DiscordYtPlayer | null{
    debug(`Getting DiscordYtPlayer for guild ${guildId}`);
    return discordYtPlayerMap.get(guildId) ?? null;
}

export function deleteDiscordYtPlayer(guildId: string): boolean{
    debug(`Deleting DiscordYtPlayer for guild ${guildId}`);
    return discordYtPlayerMap.delete(guildId);
}