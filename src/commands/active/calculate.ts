const debug = require("debug")("ChrezBot:calculate");

import { BOT_PREFIXES } from "@config";
import { MyEmbedBuilder, CommandBuilder, calculateExpressionString, ErrorValidation } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, SlashCommandBuilder } from "discord.js";

// const units: Map<string, number> = new Map([ 
//     ["k", 3], 
//     ['m', 6],
//     ['b', 9],
//     ['t', 12],
// ]);

// function replaceZeroWithUnit(num: number){
//     // count the number of zeros
//     let count = 0;
//     for(; num % 10 === 0 && num > 0; ++count)
//         num /= 10;

//     if((count + 1) % 3 === 0 && num > 10){
//         num /= 10;
//         ++count;
//     }

//     let res = "";
//     for(const [k, v] of units){
//         if(count === v){
//             res = `${num}${k}`;
//             break;
//         }
//         else if(count % 3 > 0 && count - (count % 3) === v){
//             res = `${num}${"0".repeat(count % 3)}${k}`;
//             break;
//         }
//     }

//     if(res === "")
//         res = `${num}`;

//     return res;
// }

const run = async (args?: I_Calculate): Promise<MessageCreateOptions & InteractionReplyOptions> => {
    if(!args)
        throw new ErrorValidation("chat_command_option_unavailable");

    const res = calculateExpressionString(args.expression);
    const expressionToSend = args.expression.replaceAll('*', '\\*');

    const embed = new MyEmbedBuilder();

    // let result: string = `${res}`;
    // const isExpressionHaveUnit = args.expression.match(/(k|m|t|b)/) !== null;
    // // remove trailing 000... when the expression have measurement unit (like k, m, t, ...)
    // // 4k + 4k = 8k not 8000 and 4k * 4k = 16m
    // if(isExpressionHaveUnit && res >= 1000){
    //     // count the number of zeros
    //     result = replaceZeroWithUnit(Number.parseInt(`${result}`) ?? 0);
    // }

    embed.setTitle("calculates the expression")
        .setDescription(`${expressionToSend} = ${res}`);

    return {
        embeds: [embed]
    };
}

interface I_Calculate{
    expression: string;
}

const calculate = new CommandBuilder<I_Calculate>({
    name: "calculate",
    alias: ["math", "m", "calc"],
    description: "Calculates a math expression",
    examples: [
        {command: `${BOT_PREFIXES[0]} math 2 + 3`, description: "2 + 3 = 5"},
        {command: `${BOT_PREFIXES[0]} math 2k + 2^3`, description: "2k + 2^3 = 2008"}
    ],
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("calculate")
            .setDescription("Calculates a math expression")
            .addStringOption(opt => opt.setName("expression")
            .setDescription("the expressions to calculate")
            .setRequired(true)),
        interact: async (interaction, args) => {
            const embeds = await run(args);

            await interaction.reply(embeds)
        },
        getParameter(interaction) {
            const expression = interaction.options.getString("expression", true);

            return {expression};
        }
    },
    chat: {
        execute: async (message, args) => {
            const embeds = await run(args);

            await message.channel.send(embeds);
        },
        getParameter(_, args) {
            if(args.length === 0)
                throw new Error("no expression to be evaluated!");
    
            const expression: string = args.join("");
    
            return {expression};
        }
    },
})

export default calculate;