"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const debug_1 = __importDefault(require("debug"));
const event = [
    discord_js_1.Events.ClientReady,
    () => {
        console.log(`Bot ready! running on mode ${_config_1.MODE}`);
        (0, debug_1.default)(`discord.js version: ${discord_js_1.version}\nbot version: ${_config_1.botVersion}`);
    }
];
exports.default = event;
//# sourceMappingURL=ready.js.map