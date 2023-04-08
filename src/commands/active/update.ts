import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import updates from "@assets/messages/active/update.json";

const command: CommandReturnTypes = {
    name: "update",
    alias: ["u", "news"],
    description: "Gives you update about chrezbot (news and bugfixes)",
    execute: (message, args) => {
        const embed = new MyEmbedBuilder();
        let update = updates[updates.length - 1];
        
        if(args[0] !== undefined){
            const find = updates.find(update => update.version === args[0]);
            if(find === undefined)
                throw new Error(`version ${args[0]} cannot be found!`);
            update = find;
        }

        embed.setTitle(`Chrezbot \`v${update.version}\` news and bugfixes`)
            if(update.news)
                embed.addFields({name: "news", value: update.news.join("\n")})
            if(update.bugfix)
                embed.addFields({name: "bugfix", value: update.bugfix.join("\n")});
        
        message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("update")
            .setDescription("Gives you uppdate about ChrezBot (news and bugfixes)")
            .addStringOption(opt => {
                for(const update of updates)
                    opt.addChoices({name: `v${update.version}`, value: update.version})

                opt.setName("version");
                opt.setDescription("Version to specify");

                return opt;
                }),

        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            
            const embed = new MyEmbedBuilder();
            const version = interaction.options.getString("version", false);

            let update = updates[updates.length - 1];
            if(version !== null){
                const find = updates.find(update => update.version === version);
                if(find === undefined)
                    throw new Error(`version ${version} cannot be found!`);
                update = find;
            }

            embed.setTitle(`Chrezbot \`v${update.version}\` news and bugfixes`)
                if(update.news)
                    embed.addFields({name: "news", value: update.news.join("\n")})
                if(update.bugfix)
                    embed.addFields({name: "bugfix", value: update.bugfix.join("\n")});
            
            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;