"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const discord_js_1 = require("discord.js");
const basicFunctions_1 = require("../../modules/basicFunctions");
const _config_1 = require("../../config");
function help(index) {
    const run = (message, args) => {
        let command = null;
        const embed = new basicFunctions_1.MyEmbedBuilder();
        if ((0, customTypes_1.isChatInputCommandInteraction)(message))
            command = message.options.getString("command", false);
        else if (command && command[0] !== undefined)
            command = command[0];
        if (command === null) {
            // displays all active commands
            embed.setTitle("Chrez-Bot active command help menu")
                .setDescription("here are the list of commands that chrezbot can use")
                .setFields(index.map(idx => { return { name: `\`${_config_1.prefixes[0]} ${idx.name}\``, value: idx.description, inline: true }; }));
        }
        else {
            const find = index.find(idx => {
                if (idx.name === command)
                    return true;
                if (idx.alias)
                    return idx.alias.find(al => al === command) !== undefined;
                return false;
            });
            if (find === undefined)
                throw new Error("Cannot find the active command or its aliases!");
            embed.setTitle(`${_config_1.prefixes[0]} ${find.name} ${find.slash ? `or \`/${find.slash.slashCommand.name}\`` : ""}`)
                .setDescription(find.description);
            if (find.examples && find.examples.length > 0) {
                embed.addFields({ name: "Examples", value: "\u200B" });
                embed.addFields(find.examples.map(example => { return { name: example.command, value: example.description ?? "\u200B", inline: true }; }));
            }
            if (find.alias)
                embed.setFooter({ text: `possible alias for this command: ${find.alias.map(al => `\`${_config_1.prefixes[0]} ${al}\``).join(", ")}` });
        }
        return embed;
    };
    const command = {
        name: "help",
        description: "give all commands for chrezbot",
        alias: ["h"],
        execute: async (message, args) => {
            const embed = run(message, args);
            await message.channel.send({ embeds: [embed] });
        },
        slash: {
            slashCommand: new discord_js_1.SlashCommandBuilder()
                .setName("help")
                .setDescription("give all commands for chrezbot or specify which command to check").
                addStringOption(opt => {
                opt.setName("command").setDescription("command to check");
                for (const idx of index)
                    opt.addChoices({ name: `${_config_1.prefixes[0]} ${idx.name}`, value: idx.name });
                return opt;
            }),
            interact: (interaction) => {
                if (!interaction.isChatInputCommand())
                    throw new Error("Bot can't reply the interaction received");
                const embed = run(interaction);
                interaction.reply({ embeds: [embed] });
            }
        }
    };
    return command;
}
;
exports.default = help;
