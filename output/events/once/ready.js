"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const event = {
    name: discord_js_1.Events.ClientReady,
    execute: (client) => {
        console.log(`Bot ready! Running on Discord ${discord_js_1.version}`);
    }
};
exports.default = event;
