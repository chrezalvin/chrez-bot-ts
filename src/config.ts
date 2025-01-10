import testConfig from "../config.json";
import packageJson from "../package.json";

const config = testConfig as Partial<typeof testConfig>;

const defaultConfig = {
    BOT_MAX_MESSAGE_ALLOWED: 100,
    BOT_MESSAGE_DELETE_TIME: 10,
    PORT: "3000",
};

type Mode = "development" | "production";
// Note: production mode removes use of debug tools but some log (console) will still be used whenever error happen
export let MODE: Mode = config.MODE as Mode | undefined ?? "development";

// basic configs
/**
 * max character bot can allow, if message word count is higher then the message will be ignored
 * only used in text-based command
 */
export const MAX_MESSAGE_ALLOWED = config.BOT_MAX_MESSAGE_ALLOWED ?? defaultConfig.BOT_MAX_MESSAGE_ALLOWED;

/**
 * time for error message to be deleted (in seconds)
 */
export const MESSAGE_DELETE_TIME = config.BOT_MESSAGE_DELETE_TIME ?? defaultConfig.BOT_MESSAGE_DELETE_TIME;

/**
 * cooldown time for inline command per user (in seconds)
 */
export const INLINE_COMMAND_COLDOWN_TIME = MODE === "development" ? 3 : 5;

/**
 * Bot's owner ID located in Developer Portal
 */
export const BOT_OWNER_ID = config.BOT_OWNER_ID ?? "";

/**
 * Bot's client ID located in Developer Portal
 */
export const BOT_CLIENT_ID = config.BOT_CLIENT_ID ?? "";

/**
 * Bot's Guild ID whitelist
 */
export const BOT_GUILD_IDS = config.BOT_GUILD_IDS ?? "";

/**
 * Bot's prefixes and their alternatives
 */
export const BOT_PREFIXES = config.BOT_PREFIXES ?? [];

/**
 * Bot's trusted user ID
 */
export const BOT_TRUSTED_IDS = config.BOT_TRUSTED_IDS ?? [];

/**
 * current bot version
 */
export const BOT_VERSION = packageJson.version;

// still string | undefined so i put null coalescing
export const DISCORD_TOKEN = config.DISCORD_TOKEN ?? "";

// still string | undefined so i put null coalescing
export const CLIENT_ID = config.DISCORD_CLIENT_ID ?? "";

/**
 * Bot's Client secret used for OAuth2
 */
export const CLIENT_SECRET = config.DISCORD_CLIENT_SECRET ?? "";

/**
 * Server's port (defaults to 3000)
 */
export const port = config.PORT ?? defaultConfig.PORT;

/**
 * Discord's OAuth2 Redirect URL, used for the app authentication
 */
export const OAUTH2_REDIRECT_URL = config.DISCORD_OAUTH2_REDIRECT_URL ?? "";

/**
 * Discord's OAuth2 Redirect URL, used for the server authentication
 */
export const OAUTH2_REDIRECT_URL_SERVER = config.DISCORD_OAUTH2_REDIRECT_URL_SERVER ?? "";

/**
 * Server's session secret
 */
export const SESSION_SECRET = config.SESSION_SECRET ?? "";

/**
 * Supabase URL
 */
export const SUPABASE_URL = config.SUPABASE_URL ?? "";

/**
 * Supabase key
 */
export const SUPABASE_KEY = config.SUPABASE_KEY ?? "";

/**
 * Whitelisted URL for CORS
 */
export const CORS_ORIGIN= config.CORS_ORIGIN ?? "";

// FROM HERE IS THE CHECKING FOR .env
if(config.MODE === "production" || config.MODE === "development")
    MODE = config.MODE;
else{
    console.warn("Cannot find either production or development mode, assuming development mode");
    MODE =  "development";
}

if(config.DISCORD_TOKEN === ""){
    throw new Error("Couldn't find DISCORD_TOKEN in .env");
}

if(config.DISCORD_APPLICATION_ID === "")
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

if(!config.BOT_MAX_MESSAGE_ALLOWED)
    console.warn("BOT_MAX_MESSAGE_ALLOWED is not defined, using default value instead");

if(!config.BOT_MESSAGE_DELETE_TIME)
    console.warn("BOT_MESSAGE_DELETE_TIME is not defined, using default value instead");