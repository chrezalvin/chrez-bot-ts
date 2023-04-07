"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_ID = exports.DISCORD_TOKEN = exports.MODE = exports.guildIDs = exports.botVersion = exports.prefixes = exports.ownerID = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var config_json_1 = require("./assets/configs/config.json");
Object.defineProperty(exports, "ownerID", { enumerable: true, get: function () { return config_json_1.ownerID; } });
Object.defineProperty(exports, "prefixes", { enumerable: true, get: function () { return config_json_1.prefixes; } });
Object.defineProperty(exports, "botVersion", { enumerable: true, get: function () { return config_json_1.botVersion; } });
Object.defineProperty(exports, "guildIDs", { enumerable: true, get: function () { return config_json_1.guildIDs; } });
if (process.env.MODE === "production" || process.env.MODE === "development")
    exports.MODE = process.env.MODE;
else {
    console.warn("Cannot find either production or development mode, assuming development mode");
    exports.MODE = "development";
}
if (process.env.DISCORD_TOKEN === "") {
    throw new Error("Couldn't find DISCORD_TOKEN in .env");
}
// still string | undefined so i put null coalescing
exports.DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? "";
if (process.env.APPLICATION_ID === "")
    throw new Error("Couldn't find Bot ID in .env");
// still string | undefined so i put null coalescing
exports.CLIENT_ID = process.env.APPLICATION_ID ?? "";
exports.default = { DISCORD_TOKEN: exports.DISCORD_TOKEN, MODE: exports.MODE };
