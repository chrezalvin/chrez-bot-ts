"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const story_json_1 = __importDefault(require("../../assets/messages/active/story.json"));
const _config_1 = require("../../config");
const run = (message, args) => {
    let index = (0, basicFunctions_1.rngInt)(0, story_json_1.default.length - 1);
    if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
        let num = message.options.getInteger("index", false);
        if (num !== null)
            index = num;
    }
    else {
        if (args && args[0] !== undefined) {
            let num = parseInt(args[0]);
            if (!isNaN(num))
                index = num;
        }
    }
    if (index >= story_json_1.default.length)
        throw new Error(`index out of bounds, please choose between 0 to ${story_json_1.default.length - 1}`);
    if (index < 0)
        throw new Error(`index cannot be negative`);
    const story = story_json_1.default[index];
    const embed = new basicFunctions_1.MyEmbedBuilder()
        .setDescription(story.description.join("\n"))
        .setTitle(`${story.title} by ${story.author}`);
    return embed;
};
const command = {
    name: "story",
    alias: [],
    description: "Creates a random story",
    examples: [
        { command: `${_config_1.prefixes[0]} story`, description: "give random story" },
        { command: `${_config_1.prefixes[0]} story 3`, description: "give story #3" }
    ],
    execute: (message, args) => {
        const embed = run(message, args);
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("story")
            .setDescription("Creates a random story, you can specify which story you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a story")),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = run(interaction);
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
