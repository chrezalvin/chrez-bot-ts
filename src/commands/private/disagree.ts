import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import {disagrees} from "@assets/data/disagrees.json";

const command: CommandReturnTypes = {
    name: "disagree",
    description: "disagrees with you",
    alias: ["reject", "diagreed", "nope", "nah"],
    execute: async (message, args?: string[]) => {
        if(args){
            const embed = new MyEmbedBuilder({title: args.join(" "), description: disagrees[rngInt(0, disagrees.length - 1)]})
            await message.channel.send({embeds: [embed]});
        }
        else
            await message.channel.send(disagrees[rngInt(0, disagrees.length - 1)]);
    },
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("disagree")
            .setDescription("disagrees with you")
            .addStringOption(str => str.setDescription("your message for chrezbot to disagree with").setRequired(false).setName("description")),
        interact: async (interaction) => {        
            const description = interaction.options.getString("description", false);
            if(description){
                const embed = new MyEmbedBuilder({title: description, description: disagrees[rngInt(0, disagrees.length - 1)]})
                await interaction.reply({embeds: [embed]});
            }
            else
                await interaction.reply(disagrees[rngInt(0, disagrees.length - 1)]);
        }
    }
};

export default command;