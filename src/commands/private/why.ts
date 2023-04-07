import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import whys from "@assets/messages/private/why.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";


const command: CommandReturnTypes = {
    name: "why",
    description: "Answering the real question",
    alias: ["y"],
    execute: (message) => {
        const why = whys[rngInt(0, whys.length - 1)];

        const embed = new MyEmbedBuilder({
            title: why.title,
            description: why.description,
            footer: {text: why.footer}
        })

        message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("why").setDescription("Answering the real question"),
        interact: (interaction) => {
            if(!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");
                const why = whys[rngInt(0, whys.length - 1)];

                const embed = new MyEmbedBuilder({
                    title: why.title,
                    description: why.description,
                    footer: {text: why.footer}
                })
        
                interaction.reply({embeds: [embed]});
        }
    }
};

export default command;