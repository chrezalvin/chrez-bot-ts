"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.firestore = exports.firebaseApp = exports.muted = exports.SUPABASE_KEY = exports.SUPABASE_URL = exports.SESSION_SECRET = exports.OAUTH2_REDIRECT_URL_SERVER = exports.OAUTH2_REDIRECT_URL = exports.port = exports.CLIENT_SECRET = exports.CLIENT_ID = exports.DISCORD_TOKEN = exports.botVersion = exports.trustedID = exports.guildIDs = exports.prefixes = exports.ownerID = exports.inline_command_coldown_time = exports.message_delete_time = exports.max_message_allowed = exports.MODE = void 0;
exports.setMute = setMute;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// firebase for database;
const app_1 = require("firebase/app");
const lite_1 = require("firebase/firestore/lite");
// Note: production mode removes use of debug tools but some log (console) will still be used whenever error happen
exports.MODE = process.env.MODE ?? "development";
// basic configs
/**
 * max character bot can allow, if message word count is higher then the message will be ignored
 * only used in text-based command
 */
exports.max_message_allowed = 100;
/**
 * time for error message to be deleted (in seconds)
 */
exports.message_delete_time = 10;
/**
 * cooldown time for inline command per user (in seconds)
 */
exports.inline_command_coldown_time = exports.MODE === "development" ? 5 : 30;
var config_json_1 = require("./assets/configs/config.json");
Object.defineProperty(exports, "ownerID", { enumerable: true, get: function () { return config_json_1.ownerID; } });
Object.defineProperty(exports, "prefixes", { enumerable: true, get: function () { return config_json_1.prefixes; } });
Object.defineProperty(exports, "guildIDs", { enumerable: true, get: function () { return config_json_1.guildIDs; } });
Object.defineProperty(exports, "trustedID", { enumerable: true, get: function () { return config_json_1.trustedID; } });
/**
 * current bot version
 */
exports.botVersion = "1.6.1";
// still string | undefined so i put null coalescing
exports.DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? "";
// still string | undefined so i put null coalescing
exports.CLIENT_ID = process.env.CLIENT_ID ?? "";
exports.CLIENT_SECRET = process.env.CLIENT_SECRET ?? "";
exports.port = process.env.PORT ?? "3000";
exports.OAUTH2_REDIRECT_URL = process.env.OAUTH2_REDIRECT_URL ?? "";
exports.OAUTH2_REDIRECT_URL_SERVER = process.env.OAUTH2_REDIRECT_URL_SERVER ?? "";
exports.SESSION_SECRET = process.env.SESSION_SECRET ?? "";
exports.SUPABASE_URL = process.env.SUPABASE_URL ?? "";
exports.SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";
// FROM HERE IS THE CHECKING FOR .env
if (process.env.MODE === "production" || process.env.MODE === "development")
    exports.MODE = process.env.MODE;
else {
    console.warn("Cannot find either production or development mode, assuming development mode");
    exports.MODE = "development";
}
if (process.env.DISCORD_TOKEN === "") {
    throw new Error("Couldn't find DISCORD_TOKEN in .env");
}
if (process.env.APPLICATION_ID === "")
    throw new Error("Couldn't find Bot ID in .env");
if (exports.SESSION_SECRET === "")
    throw new Error("Couldn't find SESSION_SECRET in .env");
if (exports.CLIENT_ID === "")
    console.warn("Warning: Couldn't find CLIENT_ID in .env");
if (exports.CLIENT_SECRET === "")
    console.warn("Warning: Couldn't find CLIENT_SECRET in .env");
if (exports.OAUTH2_REDIRECT_URL === "")
    console.warn("Warning: Couldn't find OAUTH2_REDIRECT_URL in .env");
if (exports.OAUTH2_REDIRECT_URL_SERVER === "")
    console.warn("Warning: Couldn't find OAUTH2_REDIRECT_URL_SERVER in .env");
if (exports.SUPABASE_URL === "" || exports.SUPABASE_KEY === "") {
    console.warn("Warning: Couldn't find SUPABASE DATABASE credentials in .env");
    console.warn("Warning: database feature will be disabled");
}
// muted variable to share across all modules
/**
 * whether the bot is muted or not
 */
exports.muted = false;
let timerMuted = null;
function setMute(set, callback) {
    if (timerMuted === null) {
        if (set)
            timerMuted = setTimeout(() => {
                exports.muted = false;
                timerMuted = null;
                if (callback)
                    callback();
            }, 60 * 10 * 1000);
    }
    else {
        if (set) {
            clearTimeout(timerMuted);
            timerMuted = setTimeout(() => {
                exports.muted = false;
                timerMuted = null;
                if (callback)
                    callback();
            }, 60 * 10);
        }
        else {
            clearTimeout(timerMuted);
            timerMuted = null;
        }
    }
    exports.muted = set;
}
const firebase_config = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");
// check if firebase_config actually have JSON data
if (Object.keys(firebase_config).length === 0)
    throw new Error("Couldn't find FIREBASE_CONFIG in .env");
exports.firebaseApp = (0, app_1.initializeApp)(firebase_config);
exports.firestore = (0, lite_1.getFirestore)(exports.firebaseApp);
exports.supabase = (0, supabase_js_1.createClient)(exports.SUPABASE_URL, exports.SUPABASE_KEY);
//# sourceMappingURL=config.js.map