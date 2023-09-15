import {config} from "dotenv"; config();

// basic configs
// max character bot can allow, if message word count is higher then the message will be ignored
export const max_message_allowed = 300;

export {ownerID, prefixes, botVersion, guildIDs, trustedID} from "./assets/configs/config.json";

// Note: production mode removes use of debug tools but some log (console) will still be used whenever error happen
export let MODE: "development" | "production";

if(process.env.MODE === "production" || process.env.MODE === "development")
    MODE = process.env.MODE;
else{
    console.warn("Cannot find either production or development mode, assuming development mode");
    MODE =  "development";
}

if(process.env.DISCORD_TOKEN === ""){
    throw new Error("Couldn't find DISCORD_TOKEN in .env");
}

// still string | undefined so i put null coalescing
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? "";

if(process.env.APPLICATION_ID === "")
    throw new Error("Couldn't find Bot ID in .env");

// still string | undefined so i put null coalescing
export const CLIENT_ID = process.env.CLIENT_ID ?? "";

if(CLIENT_ID === "") console.warn("Warning: Couldn't find CLIENT_ID in .env");

export const CLIENT_SECRET = process.env.CLIENT_SECRET ?? "";

if(CLIENT_SECRET === "") console.warn("Warning: Couldn't find CLIENT_SECRET in .env");

export const port = process.env.PORT ?? "3000";