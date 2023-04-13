import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import laughs from "@assets/messages/private/laugh.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";


const command: CommandReturnTypes = {
    name: "laugh",
    description: "laughs at whoever you point to",
    alias: ["haha", "l", "laughs", "heh"],
    execute: async (message) => {
        const laugh = laughs[rngInt(0, laughs.length - 1)];

        const embed = new MyEmbedBuilder({
            title: "Chrezbot is laughing",
            description: laugh
        })

        await message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("laugh").setDescription("laughs at you"),
        interact: async (interaction) => {
            if(!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");
            const laugh = laughs[rngInt(0, laughs.length - 1)];

            const embed = new MyEmbedBuilder({
                title: "ChrezBot is Laughing",
                description: laugh
            })
        
            await interaction.reply({embeds: [embed]});
        }
    }
};

export default command;