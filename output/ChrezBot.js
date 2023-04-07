"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChrezBot = void 0;
const discord_js_1 = require("discord.js");
// extends the command files from Client
class ChrezBot extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this._events = [];
        this._commands = new discord_js_1.Collection();
    }
    registerEvent(eventType, eventName) {
    }
}
exports.ChrezBot = ChrezBot;
