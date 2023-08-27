import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";
import {agrees} from "@assets/data/agrees.json";

const command: CommandReturnTypes = {
    name: "agree",
    description: "Agrees with you",
    alias: ["agrees", "agreed", "approve"],
    execute: async (message, args?: string[]) => {
        if(args){
            const embed = new MyEmbedBuilder({title: args.join(" "), description: agrees[rngInt(0, agrees.length - 1)]})
            await message.channel.send({embeds: [embed]});
        }
        else
            await message.channel.send(agrees[rngInt(0, agrees.length - 1)]);
    },
    slash:{
        slashCommand: new SlashCommandBuilder()
            .setName("agree")
            .setDescription("Agrees with you")
            .addStringOption(str => str.setDescription("your message for chrezbot to agree with").setRequired(false).setName("description")),
        interact: async (interaction) => {
            const description = interaction.options.getString("description", false);
            if(description){
                const embed = new MyEmbedBuilder({title: description, description: agrees[rngInt(0, agrees.length - 1)]})
                await interaction.reply({embeds: [embed]});
            }
            else
                await interaction.reply(agrees[rngInt(0, agrees.length - 1)]);
        }
    }
};

export default command;