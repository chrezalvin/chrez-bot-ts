"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _config_1 = require("../../config");
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const evaluatex = require("evaluatex");
function replaceUnit(match, p1) {
    switch (p1) {
        case 'k': return match.replace(/k/g, '000');
        case 'm': return match.replace(/m/g, '000000');
        case 'b': return match.replace(/b/g, '000000000');
        case 't': return match.replace(/t/g, '000000000000');
        default: return match;
    }
}
function replaceFunction(match, p1, p2) {
    switch (p1) {
        case 'sum': return `(${p2.replaceAll(',', '+')})`;
        case 'multiply':
        case 'mult': return `(${p2.replaceAll(',', '*')})`;
        case 'subtract':
        case 'sub': return `(${p2.replaceAll(',', '-')})`;
        default: return "";
    }
}
// here's the character that will be replaced
const replaceable = new Map([
    [/\d+(\w)/g, replaceUnit],
    [/(sum|mult|multiply|sub|subtract)\(([0-9,]*)\)/g, replaceFunction],
    ['x', '*'],
    [/[÷|:]/g, '/'],
    ['%', '/100'],
    [/[v|√]\(?(\d+)\)?/g, 'sqrt($1)'],
    [/sqrt(\d+)/g, 'sqrt($1)'],
    [/(cos|sin|tan|asin|acos|atan)(\d+)/g, '$1($2 * PI / 180)'], // turns sin255 -> sin(255 * PI / 180)
]);
const calculationPrecision = 5;
const command = {
    name: "calculate",
    alias: ["math", "m", "calc"],
    description: "Calculates a math expression",
    examples: [
        { command: `${_config_1.prefixes[0]} math 2 + 3`, description: "2 + 3 = 5" },
        { command: `${_config_1.prefixes[0]} math 2k + 2^3`, description: "2k + 2^3 = 2008" }
    ],
    execute: (message, args) => {
        if (args === undefined) {
            const embed = new basicFunctions_1.MyEmbedBuilder().setError({ description: "no math expression is given!" });
            message.channel.send({ embeds: [embed] });
            return;
        }
        // the expression that will be proccessed
        // also escapes the special characters
        let expression = args.join('');
        // the expression that will be send instead for easier reading
        let expressionSend = expression.replaceAll('*', '\\*');
        if (expression === '') {
            const embed = new basicFunctions_1.MyEmbedBuilder().setError({ description: "no expression to be evaluated!" });
            message.channel.send({ embeds: [embed] });
            return;
        }
        for (const [key, val] of replaceable)
            if (typeof val === "string")
                expression = expression.replaceAll(key, val);
            else
                expression = expression.replaceAll(key, val);
        let result = evaluatex(expression)();
        // round the result to the specified precision
        // result = result.toFixed(calculationPrecision); TODO
        // remove the trailling zeros
        // result = result.replace(/\.?0+$/, ''); TODO
        const myEmbed = new basicFunctions_1.MyEmbedBuilder()
            .setTitle("calculates the expression")
            .setDescription(`${expressionSend} = ${result}`);
        message.channel.send({ embeds: [myEmbed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder()
            .setName("calculate")
            .setDescription("Calculates a math expression")
            .addStringOption(opt => opt.setName("expression").setDescription("the expressions to calculate").setRequired(true)),
        interact: (interaction) => {
            if (!interaction.isCommand() || !interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            let expression = interaction.options.getString("expression", true);
            let expressionSend = expression.replaceAll('*', '\\*');
            expression = expression.replaceAll(" ", "");
            for (const [key, val] of replaceable)
                if (typeof val === "string")
                    expression = expression.replaceAll(key, val);
                else
                    expression = expression.replaceAll(key, val);
            let result = evaluatex(expression)();
            const myEmbed = new basicFunctions_1.MyEmbedBuilder()
                .setTitle("calculates the expression")
                .setDescription(`${expressionSend} = ${result}`);
            interaction.reply({ embeds: [myEmbed] });
        }
    }
};
exports.default = command;
