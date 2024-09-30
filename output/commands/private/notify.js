"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const basicFunctions_1 = require("../../modules/basicFunctions");
function run(args) {
    if (args) {
    }
}
const command = {
    name: "notify",
    description: "notify users, it uses @everyone but you can change it in the settings",
    alias: [],
    execute: async (message, args) => {
        // slash command exclusive
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder()
            .setName("notifyRaid")
            .setDescription("notify users for raid, it uses @everyone but you can change it in the settings")
            // .addStringOption(str => str.setName("title").setDescription("title of your notification embed").setRequired(true))
            // .addStringOption(str => str.setName("description").setDescription("description of your notification embed").setRequired(false))
            .addRoleOption(role => role.setName("role").setDescription("role to notify (default to @everyone)").setRequired(false))
            .addStringOption(str => str.setName("time").setDescription("time for raid hh:mm (japanese time)").setRequired(true)),
        interact: async (interaction) => {
            // const title = interaction.options.getString("title", true);
            // const description = interaction.options.getString("description", false);
            const role = interaction.options.getRole("role", false);
            const time = interaction.options.getString("time", true);
            if (!time.match(/\d?\d:\d?\d/))
                throw new Error("time format is wrong, please use hh:mm (japanese time)");
            const temp = time.split(':').map(str => parseInt(str));
            const hour = temp[0];
            const minute = temp[1];
            const inputDate = new Date();
            inputDate.setHours(hour);
            inputDate.setMinutes(minute);
            const remainingTime = inputDate.getTime() - Date.now();
            const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const embedTitle = `Raid in ${remainingHours}:${remainingMinutes}`;
            const embedDescription = `Raid will be held at ${hour}:${minute} (japanese time)`;
            const embed = new basicFunctions_1.MyEmbedBuilder({ title: embedTitle, description: embedDescription });
            await interaction.reply({ content: role == null ? "@everyone" : role.toString(), embeds: [embed] });
        }
    }
};
exports.default = command;
