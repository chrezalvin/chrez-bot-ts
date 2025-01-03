import { createClient } from "@supabase/supabase-js";
import {config} from "dotenv"; config();

// firebase for database;
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore/lite";

type Mode = "development" | "production";
// Note: production mode removes use of debug tools but some log (console) will still be used whenever error happen
export let MODE: Mode = process.env.MODE as Mode | undefined ?? "development";

// basic configs
/**
 * max character bot can allow, if message word count is higher then the message will be ignored
 * only used in text-based command
 */
export const max_message_allowed = 100;

/**
 * time for error message to be deleted (in seconds)
 */
export const message_delete_time = 10;

/**
 * cooldown time for inline command per user (in seconds)
 */
export const inline_command_coldown_time = MODE === "development" ? 3 : 5;
export {ownerID, prefixes, guildIDs, trustedID} from "./assets/configs/config.json";

/**
 * current bot version
 */
export const botVersion = "1.9.2";

// still string | undefined so i put null coalescing
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? "";

// still string | undefined so i put null coalescing
export const CLIENT_ID = process.env.CLIENT_ID ?? "";

export const CLIENT_SECRET = process.env.CLIENT_SECRET ?? "";
export const port = process.env.PORT ?? "3000";
export const OAUTH2_REDIRECT_URL = process.env.OAUTH2_REDIRECT_URL ?? "";
export const OAUTH2_REDIRECT_URL_SERVER = process.env.OAUTH2_REDIRECT_URL_SERVER ?? "";
export const SESSION_SECRET = process.env.SESSION_SECRET ?? "";

export const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";

export const CORS_ORIGIN= process.env.CORS_ORIGIN ?? "";

// FROM HERE IS THE CHECKING FOR .env

if(process.env.MODE === "production" || process.env.MODE === "development")
    MODE = process.env.MODE;
else{
    console.warn("Cannot find either production or development mode, assuming development mode");
    MODE =  "development";
}

if(process.env.DISCORD_TOKEN === ""){
    throw new Error("Couldn't find DISCORD_TOKEN in .env");
}

if(process.env.APPLICATION_ID === "")
    throw new Error("Couldn't find Bot ID in .env");

if(SESSION_SECRET === "") throw new Error("Couldn't find SESSION_SECRET in .env");

if(CLIENT_ID === "") console.warn("Warning: Couldn't find CLIENT_ID in .env");

if(CLIENT_SECRET === "") console.warn("Warning: Couldn't find CLIENT_SECRET in .env");

if(OAUTH2_REDIRECT_URL === "") console.warn("Warning: Couldn't find OAUTH2_REDIRECT_URL in .env");
if(OAUTH2_REDIRECT_URL_SERVER === "") console.warn("Warning: Couldn't find OAUTH2_REDIRECT_URL_SERVER in .env");

if(SUPABASE_URL === "" || SUPABASE_KEY === "") {
    console.warn("Warning: Couldn't find SUPABASE DATABASE credentials in .env");
    console.warn("Warning: database feature will be disabled");
}

// checking for CORS in .env
if(MODE === "production")
    if(CORS_ORIGIN === "")
        throw new Error("Couldn't find CORS_ORIGIN in .env");


// muted variable to share across all modules
/**
 * whether the bot is muted or not
 */
export let muted = false;

let timerMuted: NodeJS.Timeout| null = null;

export function setMute(set: boolean, callback?: () => void){
    if(timerMuted === null){
        if(set)
            timerMuted = setTimeout(() => {
                muted = false;
                timerMuted = null;
                if(callback)
                    callback();
            }, 60 * 10 * 1000);
    }
    else{
        if(set){
            clearTimeout(timerMuted);
            timerMuted = setTimeout(() => {
                muted = false;
                timerMuted = null;
                if(callback)
                    callback();
            }, 60 * 10);
        }
        else{
            clearTimeout(timerMuted);
            timerMuted = null;
        }
    }
    muted = set;
}

const firebase_config = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");
// check if firebase_config actually have JSON data
if(Object.keys(firebase_config).length === 0)
    throw new Error("Couldn't find FIREBASE_CONFIG in .env");

export const firebaseApp = initializeApp(firebase_config);
export const firestore = getFirestore(firebaseApp);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);