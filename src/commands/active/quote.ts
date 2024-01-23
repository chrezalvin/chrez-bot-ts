const debug = require("debug")("ChrezBot:quote");

import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { getProfileByID } from "@modules/profiles";

import { SlashCommandBuilder } from "discord.js";
import quotes from "@assets/messages/active/quote.json";
import { prefixes } from "@config";
import { CommandBuilder } from "@modules/CommandBuilder";

const run = (args?: I_Quote) => {
    let index: number = args?.index ?? rngInt(0, quotes.length - 1);

    if(index >= quotes.length)
        throw new Error(`index out of bounds, please choose between 0 to ${quotes.length - 1}`);
    if(index < 0)
        throw new Error(`index cannot be negative`);

    const embed = new MyEmbedBuilder();
    const quote = quotes[index];

    if(quote.memberRef){
        const member = getProfileByID(quote.memberRef);
        embed.setDescription(quote.description.join("\n"))
            .setAuthor({name: quote.author, iconURL: `https://cdn.discordapp.com/avatars/${quote.memberRef}/${member?.avatarID}.webp`})
            .setFooter({text: `quote #${index}`});
    }
    else{
        embed.setDescription(quote.description.join("\n"))
            .setTitle(`Quote #${index}`)
            .setFooter({text: `this quote is made by ${quote.author}`});
    }

    return [embed];
}

interface I_Quote{
    index: number;
};

const quote = new CommandBuilder<I_Quote>()
    .setName("quote")
    .setAlias(["q"])
    .setDescription("Creates a random quote")
    .setExamples([
        {command: `${prefixes[0]} quote`, description: "give random quote"},
        {command: `${prefixes[0]} quote 19`, description: "give quote #19"}
    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("quote")
            .setDescription("Creates a random quote, you can specify which quote you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a quote")),
        interact: async (interaction, args) => {
            const embeds = run(args);
            await interaction.reply({embeds});
        },
        getParameter(interaction) {
            const getOpt = interaction.options.getInteger("index", false) ?? rngInt(0, quotes.length - 1);

            return {index: getOpt};
        }
    })
    .setChat({
        getParameter(_, args) {
            let index = rngInt(0, quotes.length - 1);
            if(args && !isNaN(parseInt(args[0])))
                index = parseInt(args[0]);

            return {index};
        },
        execute: async (message, args) => {
            const embeds = run(args);

            message.channel.send({embeds});
        },
    })
    .setMode("unavailable");

export default quote;