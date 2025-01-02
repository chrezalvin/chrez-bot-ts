import DiscordYtPlayer from "@library/DiscordYtPlayer";

const discordYtPlayerMap = new Map<string, DiscordYtPlayer>();

const discordYtPlayer = new DiscordYtPlayer();

export { discordYtPlayer, discordYtPlayerMap };