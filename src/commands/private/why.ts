import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import whys from "@assets/messages/private/why.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";


const command: CommandReturnTypes = {
    name: "why",
    description: "Answering the real question",
    alias: ["y"],
    execute: async (message) => {
        const why = whys[rngInt(0, whys.length - 1)];

        const embed = new MyEmbedBuilder({
            title: why.title,
            description: why.description,
            footer: {text: why.footer}
        })

        await message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("why").setDescription("Answering the real question"),
        interact: async (interaction) => {
            const why = whys[rngInt(0, whys.length - 1)];

            const embed = new MyEmbedBuilder({
                title: why.title,
                description: why.description,
                footer: {text: why.footer}
            })
        
            await interaction.reply({embeds: [embed]});
        }
    }
};

export default command;