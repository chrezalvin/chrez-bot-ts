"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const yomama_json_1 = __importDefault(require("../../assets/messages/active/yomama.json"));
const _config_1 = require("../../config");
const run = (message, args) => {
    let index = (0, basicFunctions_1.rngInt)(0, yomama_json_1.default.length - 1);
    if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
        const getOpt = message.options.getInteger("index", false);
        if (getOpt !== null)
            index = getOpt;
    }
    else {
        if (args && !isNaN(parseInt(args[0])))
            index = parseInt(args[0]);
    }
    if (index >= yomama_json_1.default.length)
        throw new Error(`index out of bounds, please choose between 0 to ${yomama_json_1.default.length - 1}`);
    if (index < 0)
        throw new Error(`index cannot be negative`);
    const embed = new basicFunctions_1.MyEmbedBuilder();
    const yomama = yomama_json_1.default[index];
    embed.setDescription(yomama)
        .setTitle(`Yomama #${index}`);
    return embed;
};
const command = {
    name: "yomama",
    alias: ["yo", "mama"],
    description: "Creates a random yo mama joke",
    examples: [
        { command: `${_config_1.prefixes[0]} yomama`, description: "give random yo mama joke" },
        { command: `${_config_1.prefixes[0]} yomama 19`, description: "give yo mama jokes #19" }
    ],
    execute: (message, args) => {
        const embed = run(message, args);
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("yomama")
            .setDescription("Creates a random yo mama joke, you can specify which joke you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a joke")),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = run(interaction);
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
