"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const event = {
    name: discord_js_1.Events.InteractionCreate,
    execute(interaction) {
        if (interaction.isChatInputCommand())
            console.log(`accepted interaction by ${interaction.commandName}`);
    }
};
exports.default = event;
