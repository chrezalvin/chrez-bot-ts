"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const hugs = [
    "hugs you, making you warm and tender. Until you reach al dente",
    "hugs you, making you feel like a warm and tender chicken",
    "\*hugs\*",
];
const slashCommandBuilder = new discord_js_1.SlashCommandBuilder()
    .setName("hug")
    .setDescription("gives hug");
const hug = new _library_1.CommandBuilder()
    .setName("hug")
    .setDescription("gives hug")
    .setStatus("public")
    .setMode("available")
    .setSlash({
    slashCommand: slashCommandBuilder,
    interact: async (interaction) => {
        const hug = hugs[(0, _library_1.rngInt)(0, hugs.length - 1)];
        await interaction.reply(hug);
    },
})
    .setChat({
    execute: async (message) => {
        const hug = hugs[(0, _library_1.rngInt)(0, hugs.length - 1)];
        await message.channel.send(hug);
    },
});
exports.default = hug;
//# sourceMappingURL=hug.js.map