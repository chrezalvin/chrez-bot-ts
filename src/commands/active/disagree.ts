import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder, rngInt, CommandBuilder, CommandReturnTypes } from "@library";
import {disagrees} from "@assets/data/disagrees.json";

function run(args?: I_Disagree){
    if(args?.description !== undefined && args?.description !== ""){
        const embed = new MyEmbedBuilder({
            title: args.description, 
            description: disagrees[rngInt(0, disagrees.length - 1)]
        })

        return [embed];
    }
    else
        return disagrees[rngInt(0, disagrees.length - 1)];
}

const command: CommandReturnTypes = {
    name: "disagree",
    description: "disagrees with you",
    alias: ["reject", "diagreed", "nope", "nah"],
    execute: async (message, args?: string[]) => {
        if(args && args[0] !== ""){
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

interface I_Disagree{
    description: string;
}

const slashCommand = new SlashCommandBuilder()
    .setName("disagree")
    .setDescription("disagrees with you")
    .addStringOption(str => str.setDescription("your message for chrezbot to disagree with").setRequired(false).setName("description"))

const disagree = new CommandBuilder<I_Disagree>()
    .setName("disagree")
    .setAlias(["reject", "diagreed", "nope", "nah"])
    .setDescription("disagrees with you")
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            const description = interaction.options.getString("description", false);

            return {description: description ?? ""};
        },
        interact: async (interaction, args) => {
            const get = run(args);

            if(typeof get === "string")
                await interaction.reply({content: get});
            else
                await interaction.reply({embeds: get});
        }
    })
    .setChat({
        getParameter: (message, args) => {
            return {description: args.join(" ")};
        },
        execute: async (message, args) => {
            const get = run(args);

            if(typeof get === "string")
                await message.channel.send(get);
            else
                await message.channel.send({embeds: get});
        }
    })

export default disagree;