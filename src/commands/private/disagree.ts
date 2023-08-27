import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import {disagrees} from "@assets/data/disagrees.json";

const command: CommandReturnTypes = {
    name: "disagree",
    description: "disagrees with you",
    alias: ["reject", "diagreed", "nope", "nah"],
    execute: async (message) => {
        await message.channel.send(disagrees[rngInt(0, disagrees.length - 1)]);
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("disagree").setDescription("disagrees with you"),
        interact: async (interaction) => {        
            await interaction.reply(disagrees[rngInt(0, disagrees.length - 1)]);
        }
    }
};

export default command;