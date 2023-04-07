import {config} from "dotenv"; config();
export {ownerID, prefixes, botVersion, guildIDs} from "./assets/configs/config.json";

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
export const CLIENT_ID = process.env.APPLICATION_ID ?? "";


export default {DISCORD_TOKEN, MODE};