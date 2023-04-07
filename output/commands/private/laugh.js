"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const laugh_json_1 = __importDefault(require("../../assets/messages/private/laugh.json"));
const basicFunctions_1 = require("../../modules/basicFunctions");
const command = {
    name: "laugh",
    description: "laughs at whoever you point to",
    alias: ["haha", "l", "laughs", "heh"],
    execute: (message) => {
        const laugh = laugh_json_1.default[(0, basicFunctions_1.rngInt)(0, laugh_json_1.default.length - 1)];
        const embed = new basicFunctions_1.MyEmbedBuilder({
            title: "Chrezbot is laughing",
            description: laugh
        });
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("laugh").setDescription("laughs at you"),
        interact: (interaction) => {
            if (!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");
            const laugh = laugh_json_1.default[(0, basicFunctions_1.rngInt)(0, laugh_json_1.default.length - 1)];
            const embed = new basicFunctions_1.MyEmbedBuilder({
                title: "ChrezBot is Laughing",
                description: laugh
            });
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
