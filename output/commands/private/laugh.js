"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const laugh_json_1 = __importDefault(require("../../assets/messages/private/laugh.json"));
const basicFunctions_1 = require("../../library/basicFunctions");
const CommandBuilder_1 = require("../../library/CommandBuilder");
const run = (args) => {
    const laugh = laugh_json_1.default[(0, basicFunctions_1.rngInt)(0, laugh_json_1.default.length - 1)];
    const embed = new basicFunctions_1.MyEmbedBuilder({
        title: "Chrezbot is laughing",
        description: laugh
    });
    return { embeds: [embed] };
};
const slashCommand = new discord_js_1.SlashCommandBuilder().setName("laugh").setDescription("laughs at you");
const laugh = new CommandBuilder_1.CommandBuilder()
    .setName("laugh")
    .setDescription("laughs at you")
    .setAlias(["haha", "l", "laughs", "heh"])
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        return {};
    },
    interact: async (interaction, args) => {
        const res = run(args);
        await interaction.reply(res);
    }
})
    .setChat({
    getParameter: (message, args) => {
        return {};
    },
    execute: async (message, args) => {
        const res = run(args);
        await message.channel.send(res);
    }
});
exports.default = laugh;
