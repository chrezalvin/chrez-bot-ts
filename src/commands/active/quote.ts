const debug = require("debug")("ChrezBot:quote");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { getProfileByID } from "@modules/profiles";

import { SlashCommandBuilder } from "discord.js";
import quotes from "@assets/messages/active/quote.json";
import { prefixes } from "@config";

const run: runCommand = (message , args?: string[]) => {
    let index: number = rngInt(0, quotes.length - 1);

    if(isChatInputCommandInteraction(message)){
        const getOpt = message.options.getInteger("index", false);

        debug(`running command /quote index: ${getOpt ?? "null"}`);

        if(getOpt !== null)
            index = getOpt;
    }
    else{
        debug(`running command ${prefixes[0]} quote ${args !== undefined ? args.join(' '): ""}`);

        if(args && !isNaN(parseInt(args[0])))
            index = parseInt(args[0]);
    }

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

const command: CommandReturnTypes = {
    name: "quote",
    alias: ["q"],
    description: "Creates a random quote",
    examples: [
        {command: `${prefixes[0]} quote`, description: "give random quote"},
        {command: `${prefixes[0]} quote 19`, description: "give quote #19"}
    ],
    execute: async (message, args) => {
        const embeds = run(message, args);

        await message.channel.send({embeds});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("quote")
            .setDescription("Creates a random quote, you can specify which quote you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a quote")),
        interact: async (interaction) => {
            const embeds = run(interaction);
            await interaction.reply({embeds});
        }
    }
};

export default command;