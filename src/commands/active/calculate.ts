const debug = require("debug")("ChrezBot:calculate");

import { BOT_PREFIXES } from "@config";
import { MyEmbedBuilder, CommandBuilder, calculateExpressionString, ErrorValidation } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, SlashCommandBuilder } from "discord.js";

const run = async (args?: I_Calculate): Promise<MessageCreateOptions & InteractionReplyOptions> => {
    if(!args)
        throw new ErrorValidation("chat_command_option_unavailable");

    const res = calculateExpressionString(args.expression);
    const expressionToSend = args.expression.replaceAll('*', '\\*');

    const embed = new MyEmbedBuilder();

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