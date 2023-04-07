"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    name: "hello",
    description: "saying hello whenever user says hello",
    execute: (message) => {
        if (!message.author.bot)
            message.channel.send("hi");
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("hello").setDescription("Says hello"),
        interact: (interaction) => {
            if (!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");
            interaction.reply(`Hello, ${interaction.member?.user.username}!`);
        }
    }
};
exports.default = command;
