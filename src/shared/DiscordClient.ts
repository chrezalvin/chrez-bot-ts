import { DISCORD_TOKEN } from "@config";
import { Client, GatewayIntentBits, Partials } from "discord.js";

export const client = new Client({
    partials: [Partials.Channel],
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
    ]}
);

client.login(DISCORD_TOKEN);