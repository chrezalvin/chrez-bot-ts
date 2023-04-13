const debug = require("debug")("ChrezBot:update");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder, verifyString } from "discord.js";
import updates from "@assets/messages/active/update.json";
import { prefixes } from "@config";

const run: runCommand = (message , args?: string[]) => {
    let version: string | null = null;

    if(isChatInputCommandInteraction(message)){
        const version_hold = message.options.getString("version", false);
        debug(`running command /update timezone: ${version_hold ?? "null"}`);


        if(version_hold !== null)
            version = version_hold;
    }
    else{
        debug(`running command ${prefixes[0]} update ${args !== undefined ? args.join(' '): ""}`);

        if(args && args[0] !== undefined)
            version = args[0];
    }

    let update = updates[updates.length - 1];
    const embed = new MyEmbedBuilder();

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

    return [embed];
} 

const command: CommandReturnTypes = {
    name: "update",
    alias: ["u", "news"],
    description: "Gives you update about chrezbot (news and bugfixes)",
    execute: async (message, args) => {
        const embeds = run(message, args);

        await message.channel.send({embeds});
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

        interact: async (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            
            const embeds = run(interaction);
 
            await interaction.reply({embeds});
        }
    }
};

export default command;