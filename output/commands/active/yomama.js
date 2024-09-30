"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const yomama_json_1 = __importDefault(require("../../assets/messages/active/yomama.json"));
const _config_1 = require("../../config");
const run = (args) => {
    let index = args?.index ?? (0, _library_1.rngInt)(0, yomama_json_1.default.length - 1);
    if (index >= yomama_json_1.default.length)
        throw new Error(`index out of bounds, please choose between 0 to ${yomama_json_1.default.length - 1}`);
    if (index < 0)
        throw new Error(`index cannot be negative`);
    const embed = new _library_1.MyEmbedBuilder();
    const yomama = yomama_json_1.default[index];
    embed.setDescription(yomama)
        .setTitle(`Yomama #${index}`);
    return [embed];
};
const slashCommand = new discord_js_1.SlashCommandBuilder().setName("yomama")
    .setDescription("Creates a random yo mama joke, you can specify which joke you want using the option")
    .addIntegerOption(option => option.setName("index").setDescription("Index to target a joke"));
const yomama = new _library_1.CommandBuilder()
    .setName("yomama")
    .setAlias(["yo", "mama"])
    .setDescription("Creates a random yo mama joke")
    .setExamples([
    { command: `${_config_1.prefixes[0]} yomama`, description: "give random yo mama joke" },
    { command: `${_config_1.prefixes[0]} yomama 19`, description: "give yo mama jokes #19" }
])
    .setSlash({
    slashCommand,
    interact: async (interaction, args) => {
        const embeds = run(args);
        await interaction.reply({ embeds });
    },
    getParameter: (interaction) => {
        const index = interaction.options.getInteger("index", false);
        return { index };
    }
})
    .setChat({
    getParameter: (_, args) => {
        let index = (0, _library_1.rngInt)(0, yomama_json_1.default.length - 1);
        if (args && args[0] !== undefined) {
            if (!isNaN(parseInt(args[0])))
                index = parseInt(args[0]);
        }
        return { index };
    },
    execute: async (message, args) => {
        const embeds = run(args);
        message.channel.send({ embeds });
    },
});
exports.default = yomama;
//# sourceMappingURL=yomama.js.map