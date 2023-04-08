"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const run = (message, args) => {
    const rng = (0, basicFunctions_1.rngInt)(1, 6);
    const embed = new basicFunctions_1.MyEmbedBuilder({
        title: "rolls a die",
        description: `I rolled a die and got ${rng}`
    });
    let a = null;
    let b = null;
    if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
        a = message.options.getInteger("first", false);
        b = message.options.getInteger("second", false);
    }
    else {
        if (args !== undefined && args[0] !== undefined) {
            if (args[1] === undefined)
                throw new Error("the second number must also be inputted");
            a = parseInt(args[0]);
            b = parseInt(args[1]);
            if (isNaN(a))
                throw new Error(`the first argument should be a number, but instead got ${args[0]}`);
            if (isNaN(b))
                throw new Error(`the second argument should be a number, but instead got ${args[1]}`);
        }
    }
    if (a === null && b !== null)
        throw new Error("the first number should be inputted too");
    if (a !== null && b === null)
        throw new Error("the second number should be inputted too");
    if (a !== null && b !== null)
        embed.setTitle(`rolls a number between ${a} and ${b}`).setDescription(`I rolled a ${(0, basicFunctions_1.rngInt)(a, b)}!`);
    return embed;
};
const command = {
    name: "roll",
    alias: ["dice", "random"],
    description: "rolls a number between 2 numbers, rolls a die otherwise",
    examples: [
        { command: `${_config_1.prefixes[0]} roll`, description: "rolls a dice" },
        { command: `${_config_1.prefixes[0]} roll 1 20`, description: "rolls a number between 1 and 20" },
        { command: `${_config_1.prefixes[0]} roll 30 20`, description: "rolls a number between 30 and 20" },
    ],
    execute: (message, args) => {
        const embed = run(message, args);
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("roll")
            .setDescription("rolls a number between 2 numbers, rolls a die otherwise")
            .addIntegerOption(option => option.setName("first").setDescription("First Number"))
            .addIntegerOption(option => option.setName("second").setDescription("Second Number")),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = run(interaction);
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
