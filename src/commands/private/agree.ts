import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import {agrees} from "@assets/data/agrees.json";

const command: CommandReturnTypes = {
    name: "agree",
    description: "Agrees with you",
    alias: ["agrees", "agreed", "approve"],
    execute: async (message) => {
        await message.channel.send(agrees[rngInt(0, agrees.length - 1)]);
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("agree").setDescription("Agrees with you"),
        interact: async (interaction) => {        
            await interaction.reply(agrees[rngInt(0, agrees.length - 1)]);
        }
    }
};

export default command;