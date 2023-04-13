const debug = require("debug")("ChrezBot:hello");

import { prefixes } from "@config";
import { MyEmbedBuilder } from "@modules/basicFunctions";
import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

const run: runCommand = (message , args?: string[]) => {

    if(isChatInputCommandInteraction(message)){
        
    }
    else{

    }

    const embed = new MyEmbedBuilder();

    return [embed]
} 

const command: CommandReturnTypes = {
    name: "hello",
    description: "saying hello whenever user says hello",
    execute: async (message) => {
        debug(`running command ${prefixes[0]} hello`);
        await message.channel.send("hi");
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("hello").setDescription("Says hello"),
        interact: async (interaction) => {
            if(!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");
            debug(`running command ${prefixes[0]} hello`);
            await interaction.reply(`Hello, ${interaction.member?.user.username}!`);
        }
    }
};

export default command;