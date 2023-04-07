import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import yomamas from "@assets/messages/active/yomama.json";
import { prefixes } from "@config";

const command: CommandReturnTypes = {
    name: "yomama",
    alias: ["yo", "mama"],
    description: "Creates a random yo mama joke",
    examples: [
        {command: `${prefixes[0]} yomama`, description: "give random yo mama joke"},
        {command: `${prefixes[0]} yomama 19`, description: "give yo mama jokes #19"}
    ],
    execute: (message, args) => {
        const embed = new MyEmbedBuilder();

        let index: number;
        if(args && typeof args[0] === "string" && !isNaN(parseInt(args[0]))){
            index = parseInt(args[0]);
            if(index >= yomamas.length)
                throw new Error(`index out of bounds, please choose between 0 to ${yomamas.length - 1}`);
            if(index < 0)
                throw new Error(`index cannot be negative`);
        }
        else
            index = rngInt(0, yomamas.length - 1);

        const yomama = yomamas[index];
        embed.setDescription(yomama)
            .setTitle(`Yomama #${index}`);

        message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("yomama")
            .setDescription("Creates a random yo mama joke, you can specify which joke you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a joke")),
        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = new MyEmbedBuilder();

            let index = interaction.options.getInteger("index", false);

            if(index === null)
                index = rngInt(0, yomamas.length - 1);
            else{
                if(index >= yomamas.length)
                    throw new Error(`index out of bounds, please choose between 0 to ${yomamas.length - 1}`);
                if(index < 0)
                    throw new Error(`index cannot be negative`);
            }

            const yomama = yomamas[index];
            embed.setDescription(yomama)
                .setTitle(`yomama #${index}`);

            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;