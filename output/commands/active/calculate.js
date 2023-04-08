"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _config_1 = require("../../config");
const basicFunctions_1 = require("../../modules/basicFunctions");
const customTypes_1 = require("../../typings/customTypes");
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
const run = (message, args) => {
    let expression = null;
    if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
        expression = message.options.getString("expression", true);
    }
    else {
        if (args)
            expression = args.join("");
    }
    if (expression === null)
        throw new Error("no expression to be evaluated!");
    // the expression that will be send instead for easier reading
    let expressionSend = expression.replaceAll('*', '\\*');
    const embed = new basicFunctions_1.MyEmbedBuilder();
    for (const [key, val] of replaceable)
        if (typeof val === "string")
            expression = expression.replaceAll(key, val);
        else
            expression = expression.replaceAll(key, val);
    let result = evaluatex(expression)();
    embed.setTitle("calculates the expression")
        .setDescription(`${expressionSend} = ${result}`);
    return embed;
};
const command = {
    name: "calculate",
    alias: ["math", "m", "calc"],
    description: "Calculates a math expression",
    examples: [
        { command: `${_config_1.prefixes[0]} math 2 + 3`, description: "2 + 3 = 5" },
        { command: `${_config_1.prefixes[0]} math 2k + 2^3`, description: "2k + 2^3 = 2008" }
    ],
    execute: (message, args) => {
        const embed = run(message, args);
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder()
            .setName("calculate")
            .setDescription("Calculates a math expression")
            .addStringOption(opt => opt.setName("expression").setDescription("the expressions to calculate").setRequired(true)),
        interact: (interaction) => {
            if (!interaction.isCommand() || !interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = run(interaction);
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
