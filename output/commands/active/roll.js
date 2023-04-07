"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
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
        const embed = new basicFunctions_1.MyEmbedBuilder();
        if (args && args[0] !== undefined && args[1] !== undefined) {
            let a = parseInt(args[0]);
            let b = parseInt(args[1]);
            // error checking
            if (isNaN(a) || isNaN(b)) {
                if (isNaN(a) && isNaN(b))
                    embed.setError({ description: `both arguments should be numbers but instead you typed \`${args[0]}\` and \`${args[1]}\`` });
                else if (isNaN(a))
                    embed.setError({ description: `the first argument should be a number, but instead you typed \`${args[0]}\`` });
                else if (isNaN(b))
                    embed.setError({ description: `the second argument should be a number, but instead you typed \`${args[2]}\`` });
                else
                    embed.setError({ description: `This should never happen but I don't understand the arguments completely!` });
                message.channel.send({ embeds: [embed] });
                return;
            }
            embed.setTitle(`rolls a number between ${a} and ${b}`).setDescription(`I rolled a ${(0, basicFunctions_1.rngInt)(a, b)}!`);
        }
        else {
            embed.setTitle(`rolls a die`).setDescription(`I rolled a die and got ${(0, basicFunctions_1.rngInt)(1, 6)}!`);
        }
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("roll")
            .setDescription("rolls a number between 2 numbers, rolls a die otherwise")
            .addIntegerOption(option => option.setName("first").setDescription("First Number"))
            .addIntegerOption(option => option.setName("second").setDescription("Second Number")),
        interact: (interaction) => {
            if (!interaction.isCommand() || !interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = new basicFunctions_1.MyEmbedBuilder();
            let a = interaction.options.getInteger("first", false);
            let b = interaction.options.getInteger("second", false);
            if (a == null || b == null)
                embed.setTitle(`rolls a die`).setDescription(`I rolled a die and got ${(0, basicFunctions_1.rngInt)(1, 6)}`);
            else
                embed.setTitle(`rolls a number between ${a} and ${b}`).setDescription(`I rolled a ${(0, basicFunctions_1.rngInt)(a, b)}`);
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
