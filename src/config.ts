import {config} from "dotenv"; config();

// firebase for database;
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore/lite";

// basic configs
// max character bot can allow, if message word count is higher then the message will be ignored
export const max_message_allowed = 100;

// time for error message to be deleted (in seconds)
export const message_delete_time = 10;
export const inline_command_coldown_time = 30;

export {ownerID, prefixes, guildIDs, trustedID} from "./assets/configs/config.json";
export const botVersion = "1.3.6";

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

export const OAUTH2_REDIRECT_URL = process.env.OAUTH2_REDIRECT_URL ?? "";

if(OAUTH2_REDIRECT_URL === "") console.warn("Warning: Couldn't find OAUTH2_REDIRECT_URL in .env");

// muted variable to share across all modules
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


// all exports
