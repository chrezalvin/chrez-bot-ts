const debug = require("debug")("ChrezBot:help");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder } from "@modules/basicFunctions";
import { prefixes } from "@config";

function help(index: CommandReturnTypes[]){
    const run: runCommand = (message , args?: string[]) => {
        let command: string | null = null;
        const embed = new MyEmbedBuilder();
    
        if(isChatInputCommandInteraction(message)){
            command = message.options.getString("command", false);

            debug(`running command /help command: ${command ?? "null"}`);

        }
        else{
            if(args && args[0] !== undefined)
                command = args[0];

            debug(`running command ${prefixes[0]} help ${args !== undefined ? args.join(' '): ""}`);
        }
    
        if(command === null){
            // displays all active commands
            embed.setTitle("Chrez-Bot active command help menu")
            .setDescription("here are the list of commands that chrezbot can use")
            .setFields(index.map(idx => {return {name: `\`${prefixes[0]} ${idx.name}\``, value: idx.description, inline: true}}));
        }
        else{
            const find = index.find(idx => {
                if(idx.name === command) return true;
                if(idx.alias)
                    return idx.alias.find(al => al === command) !== undefined;
                return false;
            });
        
            if(find === undefined)
                throw new Error("Cannot find the active command or its aliases!");

            embed.setTitle(`${prefixes[0]} ${find.name} ${find.slash ? `or \`/${find.slash.slashCommand.name}\``: ""}`)
                .setDescription(find.description);
            if(find.examples && find.examples.length > 0){
                embed.addFields({name: "Examples", value: "\u200B"});
                embed.addFields(find.examples.map(example => {return {name: example.command, value: example.description ?? "\u200B", inline: true}}));
            }

            if(find.alias)
                embed.setFooter({text: `possible alias for this command: ${find.alias.map(al => `\`${prefixes[0]} ${al}\``).join(", ")}`})
        }
        
        return [embed];
    } 

    const command: CommandReturnTypes = {
        name: "help",
        description: "give all commands for chrezbot",
        alias: ["h"],
        execute: async (message, args) => {
            const embeds = run(message, args);

            await message.channel.send({embeds});
        },
        slash:{
            slashCommand: new SlashCommandBuilder()
                .setName("help")
                .setDescription("give all commands for chrezbot or specify which command to check").
                addStringOption(opt => {
                    opt.setName("command").setDescription("command to check");
                    for(const idx of index)
                        opt.addChoices({name: `${prefixes[0]} ${idx.name}`, value: idx.name})

                    return opt;
                }),
            interact: async (interaction) => {
                const embeds = run(interaction);
                
                await interaction.reply({embeds});
            }
        }
    }

    return command;
};

export default help;