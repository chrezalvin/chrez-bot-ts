const debug = require("debug")("ChrezBot:calculate");

import { prefixes } from "@config";
import { MyEmbedBuilder, CommandBuilder } from "@library";
import { SlashCommandBuilder } from "discord.js";
const evaluatex = require("evaluatex");

const units: Map<string, number> = new Map([ 
    ["k", 3], 
    ['m', 6],
    ['b', 9],
    ['t', 12],
]);

function replaceUnit(match: string, p1: string, p2: string){
    debug(`match: ${match} | p1: ${p1} | p2: ${p2}`);

    for(const [unit, num] of units){
        if(p2 === unit)
            return `(${p1} * 1${"0".repeat(num)})`;
    }
    return match;
}

function replaceFunction(match: string, p1: string, p2: string){
    switch(p1){
        case 'sum': return `(${p2.replaceAll(',', '+')})`;
        case 'multiply':
        case 'mult': return `(${p2.replaceAll(',', '*')})`;
        case 'subtract': 
        case 'sub': return `(${p2.replaceAll(',', '-')})`;
        default: return "";
    }
}

function replaceZeroWithUnit(num: number){
    // count the number of zeros
    let count = 0;
    for(; num % 10 === 0 && num > 0; ++count)
        num /= 10;

    if((count + 1) % 3 === 0 && num > 10){
        num /= 10;
        ++count;
    }

    let res = "";
    for(const [k, v] of units){
        if(count === v){
            res = `${num}${k}`;
            break;
        }
        else if(count % 3 > 0 && count - (count % 3) === v){
            res = `${num}${"0".repeat(count % 3)}${k}`;
            break;
        }
    }

    if(res === "")
        res = `${num}`;

    return res;
}

type V = ((match: string, p1: string, p2: string) => string) | ((match: string, p1: string) => string) | string

// here's the character that will be replaced
const replaceable = new Map<RegExp | string, V>([
    [/(\d*\.?\d*)(\w)/g, replaceUnit], // change k, m, b, t to 000, 000000, 000000000, 000000000000
    [/(sum|mult|multiply|sub|subtract)\(([0-9,]*)\)/g, replaceFunction], // sum(1,2,3,1,2,3) -> (1+2+3+1+2+3)
    ['x', '*'],
    [/[÷|:]/g, '/'],
    ['%', '/100'],
    [/[v|√]\(?(\d+)\)?/g, 'sqrt($1)'], // turns v(25) or v25 into sqrt(25)
    [/sqrt(\d+)/g, 'sqrt($1)'], // turns sqrt25 into sqrt(25)
    [/(cos|sin|tan|asin|acos|atan)(\d+)/g, '$1($2 * PI / 180)'], // turns sin255 -> sin(255 * PI / 180)
]);

const calculationPrecision = 5;

const run = (args?: I_Calculate) => {
    if(args === undefined) throw new Error("no expression to be evaluated!");

    let expression = args.expression;

    // the expression that will be send instead for easier reading
    let expressionSend = expression.replaceAll('*', '\\*'); 
    const embed = new MyEmbedBuilder();

    for(const [key, val] of replaceable){
        if(typeof val === "string"){
            expression = expression.replaceAll(key, val);
            debug(`replace ${key} with ${val} | expression: ${expression}`);
        }
        else{
            expression = expression.replaceAll(key, val);
            debug(`replace ${key} with ${val.name} | expression: ${expression}`);
        }

    }

    debug(`end expression: ${expression}`);
    let result = evaluatex(expression)();

    // remove trailing 000... when the expression have measurement unit (like k, m, t, ...)
    // 4k + 4k = 8k not 8000 and 4k * 4k = 16m
    if(args.isExpressionHaveUnit && result >= 1000){
        // count the number of zeros
        result = replaceZeroWithUnit(Number.parseInt(`${result}`) ?? 0);
    }

    embed.setTitle("calculates the expression")
        .setDescription(`${expressionSend} = ${result}`);

    return [embed];
} 

interface I_Calculate{
    expression: string;
    isExpressionHaveUnit: boolean;
}

const calculate = new CommandBuilder<I_Calculate>({
    name: "calculate",
    alias: ["math", "m", "calc"],
    description: "Calculates a math expression",
    examples: [
        {command: `${prefixes[0]} math 2 + 3`, description: "2 + 3 = 5"},
        {command: `${prefixes[0]} math 2k + 2^3`, description: "2k + 2^3 = 2008"}
    ],
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("calculate")
            .setDescription("Calculates a math expression")
            .addStringOption(opt => opt.setName("expression")
            .setDescription("the expressions to calculate")
            .setRequired(true)),
        interact: async (interaction, args) => {
            const embeds = run(args);

            await interaction.reply({embeds});
        },
        getParameter(interaction) {
            const expression = interaction.options.getString("expression", true);
            const isExpressionHaveUnit = expression.match(/(k|m|t|b)/) !== null;

            return {expression, isExpressionHaveUnit};
        }
    },
    chat: {
        execute: async (message, args) => {
            const embeds = run(args);

            await message.channel.send({embeds});
        },
        getParameter(_, args) {
            if(args.length === 0)
                throw new Error("no expression to be evaluated!");
    
            const expression: string = args.join("");
            const isExpressionHaveUnit = expression.match(/(k|m|t|b)/) !== null;
    
            return {expression, isExpressionHaveUnit};
        }
    },
})

export default calculate;