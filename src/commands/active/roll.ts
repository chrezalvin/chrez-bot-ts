const debug = require("debug")("ChrezBot:roll");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import { prefixes } from "@config";


const run: runCommand = (message , args?: string[]) => {
    const rng = rngInt(1, 6);
    const embed = new MyEmbedBuilder({
        title: "rolls a die",
        description: `I rolled a die and got ${rng}`
    });

    let a: number|null = null;
    let b: number|null = null;

    if(isChatInputCommandInteraction(message)){
        a = message.options.getInteger("first", false);
        b = message.options.getInteger("second", false);

        debug(`running command /roll first: ${a ?? "null"} second: ${b ?? "null"}`);
    }
    else{
        debug(`running command ${prefixes[0]} roll ${args !== undefined ? args.join(' '): ""}`);
        if(args !== undefined && args[0] !== undefined){
            if(args[1] === undefined)
                throw new Error("the second number must also be inputted");

            a = parseInt(args[0]);
            b = parseInt(args[1]);

            if(isNaN(a))
                throw new Error(`the first argument should be a number, but instead got ${args[0]}`);
            if(isNaN(b))
                throw new Error(`the second argument should be a number, but instead got ${args[1]}`);
        }
    }

    if(a === null && b !== null)
        throw new Error("the first number should be inputted too");
    if(a !== null && b === null)
        throw new Error("the second number should be inputted too");
    if(a !== null && b !== null)
        embed.setTitle(`rolls a number between ${a} and ${b}`).setDescription(`I rolled a ${rngInt(a, b)}!`);
        
    return [embed];
}

const command: CommandReturnTypes = {
    name: "roll",
    alias: ["dice", "random"],
    description: "rolls a number between 2 numbers, rolls a die otherwise",
    examples: [
        {command: `${prefixes[0]} roll`, description: "rolls a dice"},
        {command: `${prefixes[0]} roll 1 20`, description: "rolls a number between 1 and 20"},
        {command: `${prefixes[0]} roll 30 20`, description: "rolls a number between 30 and 20"},
    ],
    execute: async (message, args) => {
        const embeds = run(message, args);

        await message.channel.send({embeds});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("roll")
            .setDescription("rolls a number between 2 numbers, rolls a die otherwise")
            .addIntegerOption(option => option.setName("first").setDescription("First Number"))
            .addIntegerOption(option => option.setName("second").setDescription("Second Number")),
            
        interact: async (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embeds = run(interaction);
            
            await interaction.reply({embeds});
        }
    }
};

export default command;