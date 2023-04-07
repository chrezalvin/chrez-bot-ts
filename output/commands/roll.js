"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../modules/basicFunctions");
// const {Message} = require('discord.js');
// // const {createEmbed} = require('../../functions/createEmbed');
// // const {getRandomValue} = require('../../functions/getRandomValue');
// /**
//  * @param {Array} arguments
//  */
// module.exports = {
//     name: "roll",
//     alias: ["dice", "random"],
//     description: "rolls 0 - number if defined, rolls a die otherwise",
//     syntax: "roll <number>",
//     execute(message, arguments){
//         // check if argument[0] is valid
//         let max = parseInt(arguments.shift());
//         if(isNaN(max))
//             max = 6;
//         let myEmbed;
//         if(max == 6)
//             myEmbed = createEmbed(`Rolls a die`, `You rolled a die and got ${getRandomValue(1, max)}!`);
//         else
//             myEmbed = createEmbed(`Rolls a number between 0 - ${max}`, `I rolled a ${getRandomValue(1, max)}!`);
//         message.channel.send({embeds: [myEmbed]});
//     }
// }
const discord_js_1 = require("discord.js");
function roll(min, max) {
    return min;
}
const command = {
    name: "roll",
    alias: ["dice", "random"],
    description: "rolls a number between 2 numbers, rolls a die otherwise",
    execute: (message, args) => {
        const embed = new basicFunctions_1.MyEmbedBuilder();
        if (args && args[0] !== undefined && args[1] !== undefined) {
            let a = parseInt(args[0]);
            let b = parseInt(args[1]);
            // error checking
            if (isNaN(a) || isNaN(b)) {
                if (isNaN(a) && isNaN(b))
                    embed.setError(`both arguments should be numbers but instead you typed \`${args[0]}\` and \`${args[1]}\``);
                else if (isNaN(a))
                    embed.setError(`the first argument should be a number, but instead you typed \`${args[0]}\``);
                else if (isNaN(b))
                    embed.setError(`the second argument should be a number, but instead you typed \`${args[2]}\``);
                else
                    embed.setError(`This should never happen but I don't understand the arguments completely!`);
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
            let a = interaction.options.getNumber("First Number", false);
            let b = interaction.options.getNumber("Second Number", false);
            if (a == null || b == null)
                embed.setTitle(`rolls a die`).setDescription(`I rolled a die and got ${(0, basicFunctions_1.rngInt)(1, 6)}`);
            else
                embed.setTitle(`rolls a number between ${a} and ${b}`).setDescription(`I rolled a ${(0, basicFunctions_1.rngInt)(a, b)}`);
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
