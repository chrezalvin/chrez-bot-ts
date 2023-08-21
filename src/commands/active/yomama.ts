const debug = require("debug")("ChrezBot:yomama");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import yomamas from "@assets/messages/active/yomama.json";
import { prefixes } from "@config";

const run: runCommand = (message , args?: string[]) => {
    let index: number = rngInt(0, yomamas.length - 1);

    if(isChatInputCommandInteraction(message)){
        const getOpt = message.options.getInteger("index", false);
        debug(`running command /yomama index: ${getOpt ?? "null"}`);

        if(getOpt !== null)
            index = getOpt;
    }
    else{
        debug(`running command ${prefixes[0]} yomama ${args !== undefined ? args.join(' '): ""}`);
        if(args && args[0] !== undefined){
            if(!isNaN(parseInt(args[0])))
                index = parseInt(args[0]);
        }
    }

    if(index >= yomamas.length)
        throw new Error(`index out of bounds, please choose between 0 to ${yomamas.length - 1}`);
    if(index < 0)
        throw new Error(`index cannot be negative`);

    const embed = new MyEmbedBuilder();
    const yomama = yomamas[index];

    embed.setDescription(yomama)
            .setTitle(`Yomama #${index}`);

    return [embed];
}

const command: CommandReturnTypes = {
    name: "yomama",
    alias: ["yo", "mama"],
    description: "Creates a random yo mama joke",
    examples: [
        {command: `${prefixes[0]} yomama`, description: "give random yo mama joke"},
        {command: `${prefixes[0]} yomama 19`, description: "give yo mama jokes #19"}
    ],
    execute: async (message, args) => {
        const embeds = run(message, args);

        await message.channel.send({embeds});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("yomama")
            .setDescription("Creates a random yo mama joke, you can specify which joke you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a joke")),
        interact: async (interaction) => {
            const embeds = run(interaction);

            await interaction.reply({embeds});
        }
    }
};

export default command;