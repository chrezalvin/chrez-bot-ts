import {MyEmbedBuilder, rngInt, CommandBuilder} from "@library";

import { SlashCommandBuilder } from "discord.js";
import yomamas from "@assets/messages/active/yomama.json";
import { prefixes } from "@config";

const run = (args?: I_Yomama) => {
    let index: number = args?.index ?? rngInt(0, yomamas.length - 1);

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

interface I_Yomama{
    index: number | null;
}

const slashCommand = new SlashCommandBuilder().setName("yomama")
        .setDescription("Creates a random yo mama joke, you can specify which joke you want using the option")
        .addIntegerOption(option => option.setName("index").setDescription("Index to target a joke"));

const yomama = new CommandBuilder<I_Yomama>()
        .setName("yomama")
        .setAlias(["yo", "mama"])
        .setDescription("Creates a random yo mama joke")
        .setExamples([
            {command: `${prefixes[0]} yomama`, description: "give random yo mama joke"},
            {command: `${prefixes[0]} yomama 19`, description: "give yo mama jokes #19"}
        ])
        .setSlash({
            slashCommand,
            interact: async (interaction, args) => {
                const embeds = run(args);
    
                await interaction.reply({embeds});
            },
            getParameter: (interaction) => {
                const index = interaction.options.getInteger("index", false);
    
                return {index};
            }
        })
        .setChat({
            getParameter: (_, args) => {
                let index = rngInt(0, yomamas.length - 1);
                if(args && args[0] !== undefined){
                    if(!isNaN(parseInt(args[0])))
                        index = parseInt(args[0]);
                }
    
                return {index};
            },
            execute: async (message, args) => {
                const embeds = run(args);
    
                message.channel.send({embeds});
            },
        })

export default yomama;