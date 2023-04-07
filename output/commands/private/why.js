"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const why_json_1 = __importDefault(require("../../assets/messages/private/why.json"));
const basicFunctions_1 = require("../../modules/basicFunctions");
const command = {
    name: "why",
    description: "Answering the real question",
    alias: ["y"],
    execute: (message) => {
        const why = why_json_1.default[(0, basicFunctions_1.rngInt)(0, why_json_1.default.length - 1)];
        const embed = new basicFunctions_1.MyEmbedBuilder({
            title: why.title,
            description: why.description,
            footer: { text: why.footer }
        });
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("why").setDescription("Answering the real question"),
        interact: (interaction) => {
            if (!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");
            const why = why_json_1.default[(0, basicFunctions_1.rngInt)(0, why_json_1.default.length - 1)];
            const embed = new basicFunctions_1.MyEmbedBuilder({
                title: why.title,
                description: why.description,
                footer: { text: why.footer }
            });
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
