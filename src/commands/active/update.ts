import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import update from "@assets/messages/active/update.json";
import { botVersion } from "@config";

const command: CommandReturnTypes = {
    name: "update",
    alias: ["u", "news"],
    description: "Give you update about chrezbot (news and bugfixes)",
    execute: (message, args) => {
        const embed = new MyEmbedBuilder();

        embed.setTitle(`Chrezbot \`v${botVersion}\` news and bugfixes`)
            .addFields({name: "news", value: update.news.join("\n")})
            .addFields({name: "bugfix", value: update.bugfix.join("\n")});
        
        message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("update")
            .setDescription("Gives you uppdate about ChrezBot (news and bugfixes)"),

        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            
            const embed = new MyEmbedBuilder();

            embed.setTitle(`Chrezbot \`v${botVersion}\` news and bugfixes`)
                .addFields({name: "news", value: update.news.join("\n")})
                .addFields({name: "bugfix", value: update.bugfix.join("\n")});
            
            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;