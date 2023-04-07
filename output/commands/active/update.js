"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const update_json_1 = __importDefault(require("../../assets/messages/active/update.json"));
const _config_1 = require("../../config");
const command = {
    name: "update",
    alias: ["u", "news"],
    description: "Give you update about chrezbot (news and bugfixes)",
    execute: (message, args) => {
        const embed = new basicFunctions_1.MyEmbedBuilder();
        embed.setTitle(`Chrezbot \`v${_config_1.botVersion}\` news and bugfixes`)
            .addFields({ name: "news", value: update_json_1.default.news.join("\n") })
            .addFields({ name: "bugfix", value: update_json_1.default.bugfix.join("\n") });
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("update")
            .setDescription("Gives you uppdate about ChrezBot (news and bugfixes)"),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = new basicFunctions_1.MyEmbedBuilder();
            embed.setTitle(`Chrezbot \`v${_config_1.botVersion}\` news and bugfixes`)
                .addFields({ name: "news", value: update_json_1.default.news.join("\n") })
                .addFields({ name: "bugfix", value: update_json_1.default.bugfix.join("\n") });
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
