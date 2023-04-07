"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const command = {
    name: "bulkdelete",
    description: "saying hello whenever user says hello",
    execute: async (message, args) => {
        if (!message.channel.isTextBased())
            return;
        if (!message.guild || !message.guild.members.me)
            return;
        const embed = new basicFunctions_1.MyEmbedBuilder();
        console.log(message.guild.members.me.permissions);
        if (!message.guild.members.me.permissions.has("Administrator"))
            throw new Error("Chrezbot cannot delete message in this guild");
        if (args === undefined || args.length === 0)
            throw new Error("No amount to delete!");
        const num = parseInt(args[0]);
        if (isNaN(parseInt(args[0])))
            throw new Error("the argument given is not a number");
        if (num > 100)
            throw new Error("The maximum amount to delete is 100");
        if (num <= 0)
            throw new Error("argument can't be negative or 0");
        let amount = num;
        const res = await message.channel.bulkDelete(amount, true);
        embed.setDescription(`successfully deleted ${res.size} messages`)
            .setTitle("delete messages");
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder()
            .setName("bulkdelete")
            .setDescription("Delete multiple messages at once")
            .addIntegerOption(opt => opt
            .setName("amount")
            .setDescription("Amount of messages to delete")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)),
        interact: async (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            if (!interaction.guild || !interaction.guild.members.me)
                return;
            if (!interaction.guild.members.me.permissions.has("ManageMessages"))
                throw new Error("Chrezbot cannot delete message in this guild");
            const embed = new basicFunctions_1.MyEmbedBuilder();
            const amount = interaction.options.getInteger("amount", true);
            const res = await interaction.channel.bulkDelete(amount, true);
            if (res === undefined) {
                throw new Error("Failed to delete message!");
            }
            embed.setDescription(`successfully deleted ${res.size} messages`)
                .setTitle("delete messages");
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
