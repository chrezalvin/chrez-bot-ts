import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

import { MyEmbedBuilder } from "@modules/basicFunctions";
import { prefixes } from "@config";

function help(index: CommandReturnTypes[]){
    const command: CommandReturnTypes = {
        name: "help",
        description: "give all commands for chrezbot",
        alias: ["h"],
        execute: async (message, args) => {
            const embed = new MyEmbedBuilder();

            if(args === undefined || args.length === 0){
                // displays all active commands
                embed.setTitle("Chrez-Bot active command help menu")
                    .setDescription("here are the list of commands that chrezbot can use")
                    .setFields(index.map(idx => {return {name: `\`${prefixes[0]} ${idx.name}\``, value: idx.description, inline: true}}));

            }
            else{
                const find = index.find(idx => {
                    if(idx.name === args[0]) return true;
                    if(idx.alias)
                        return idx.alias.find(al => al === args[0]) !== undefined;
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

            await message.channel.send({embeds: [embed]});
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
            interact: (interaction) => {
                if(!interaction.isChatInputCommand())
                    throw new Error("Bot can't reply the interaction received");

                    const embed = new MyEmbedBuilder();
                    const command = interaction.options.getString("command", false);

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
                
                interaction.reply({embeds: [embed]});
            }
        }
    }

    return command;
};

export default help;