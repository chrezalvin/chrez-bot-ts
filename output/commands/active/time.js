"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const timeChoices_json_1 = __importDefault(require("../../assets/messages/active/timeChoices.json"));
const _config_1 = require("../../config");
const command = {
    name: "time",
    alias: ["t", "chrono"],
    description: "Check japanese time (and how long is it until midnight)",
    examples: [
        { command: `${_config_1.prefixes[0]} time`, description: "give current japan time (and time until midnight)" },
        { command: `${_config_1.prefixes[0]} time india`, description: "give india time (kolkata)" },
        { command: `${_config_1.prefixes[0]} time indo`, description: "give Indonesian time (Jakarta)" },
    ],
    execute: async (message, args) => {
        const time = new Date();
        // get only the hh:mm:ss format
        const embed = new basicFunctions_1.MyEmbedBuilder();
        if (args === undefined || args.length === 0) {
            const japTime = time.toLocaleString('en-US', { timeZone: "Japan", hour12: false }).split(' ')[1];
            // calculate time left
            const timeLeft = {
                hour: 24 - (time.getUTCHours() + 10) % 24,
                minute: 60 - time.getUTCMinutes()
            };
            let myText;
            if (timeLeft.minute == 0)
                myText = `${time.getHours()} hours left`;
            else if (timeLeft.hour == 0)
                myText = `${timeLeft.minute} minutes left`;
            else if (timeLeft.hour == 0 && timeLeft.minute == 0)
                myText = `It's midnight`;
            else
                myText = `${timeLeft.hour} hours and ${timeLeft.minute} minutes left`;
            embed.setTitle(`it's ${japTime} Japanese time`).setFooter({ text: `${myText} until midnight` });
        }
        else {
            for (const timeChoice of timeChoices_json_1.default) {
                if (timeChoice.criteria.find(crit => crit === args[0]) !== undefined) {
                    const localTime = time.toLocaleString('en-US', { timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium" }).split(' ');
                    embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
                    await message.channel.send({ embeds: [embed] });
                    return;
                }
            }
            throw new Error("timezone not found!");
        }
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("time")
            .setDescription("Check japanese time (and how long is it until midnight)")
            .addStringOption(opt => {
            opt.setName("timezone").setDescription("(optional) Timezone to check");
            for (const timeChoice of timeChoices_json_1.default)
                opt.addChoices({ name: timeChoice.name, value: timeChoice.timezone });
            return opt;
        }),
        interact: async (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const time = new Date();
            const timezone = interaction.options.getString("timezone", false);
            const embed = new basicFunctions_1.MyEmbedBuilder();
            if (timezone == null) {
                // get only the hh:mm:ss format
                const japTime = time.toLocaleString('en-US', { timeZone: "Japan" }).split(' ')[1];
                // calculate time left
                const timeLeft = {
                    hour: 24 - (time.getUTCHours() + 10) % 24,
                    minute: 60 - time.getUTCMinutes()
                };
                let myText;
                if (timeLeft.minute == 0)
                    myText = `${time.getHours()} hours left`;
                else if (timeLeft.hour == 0)
                    myText = `${timeLeft.minute} minutes left`;
                else if (timeLeft.hour == 0 && timeLeft.minute == 0)
                    myText = `It's midnight`;
                else
                    myText = `${timeLeft.hour} hours and ${timeLeft.minute} minutes left`;
                embed.setTitle(`it's ${japTime} Japanese time`).setFooter({ text: `${myText} until midnight` });
            }
            else {
                for (const timeChoice of timeChoices_json_1.default) {
                    if (timeChoice.timezone === timezone) {
                        const localTime = time.toLocaleString('en-US', { timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium" }).split(' ');
                        embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
                        await interaction.reply({ embeds: [embed] });
                        return;
                    }
                }
                throw new Error("timezone not found!");
            }
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
