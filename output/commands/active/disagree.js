"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const _library_1 = require("../../library");
const disagrees_json_1 = require("../../assets/data/disagrees.json");
function run(args) {
    if (args?.description) {
        const embed = new _library_1.MyEmbedBuilder({
            title: args.description,
            description: disagrees_json_1.disagrees[(0, _library_1.rngInt)(0, disagrees_json_1.disagrees.length - 1)]
        });
        return [embed];
    }
    else
        return disagrees_json_1.disagrees[(0, _library_1.rngInt)(0, disagrees_json_1.disagrees.length - 1)];
}
const command = {
    name: "disagree",
    description: "disagrees with you",
    alias: ["reject", "diagreed", "nope", "nah"],
    execute: async (message, args) => {
        if (args && args[0] !== "") {
            const embed = new _library_1.MyEmbedBuilder({ title: args.join(" "), description: disagrees_json_1.disagrees[(0, _library_1.rngInt)(0, disagrees_json_1.disagrees.length - 1)] });
            await message.channel.send({ embeds: [embed] });
        }
        else
            await message.channel.send(disagrees_json_1.disagrees[(0, _library_1.rngInt)(0, disagrees_json_1.disagrees.length - 1)]);
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder()
            .setName("disagree")
            .setDescription("disagrees with you")
            .addStringOption(str => str
            .setDescription("your message for chrezbot to disagree with")
            .setRequired(false)
            .setName("description")),
        interact: async (interaction) => {
            const description = interaction.options.getString("description", false);
            if (description) {
                const embed = new _library_1.MyEmbedBuilder({ title: description, description: disagrees_json_1.disagrees[(0, _library_1.rngInt)(0, disagrees_json_1.disagrees.length - 1)] });
                await interaction.reply({ embeds: [embed] });
            }
            else
                await interaction.reply(disagrees_json_1.disagrees[(0, _library_1.rngInt)(0, disagrees_json_1.disagrees.length - 1)]);
        }
    }
};
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("disagree")
    .setDescription("disagrees with you")
    .addStringOption(str => str.setDescription("your message for chrezbot to disagree with").setRequired(false).setName("description"));
const disagree = new _library_1.CommandBuilder()
    .setName("disagree")
    .setAlias(["reject", "diagreed", "nope", "nah"])
    .setDescription("disagrees with you")
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const description = interaction.options.getString("description", false);
        return { description: description ?? "" };
    },
    interact: async (interaction, args) => {
        const get = run(args);
        if (typeof get === "string")
            await interaction.reply({ content: get });
        else
            await interaction.reply({ embeds: get });
    }
})
    .setChat({
    getParameter: (message, args) => {
        return { description: args.join(" ") };
    },
    execute: async (message, args) => {
        const get = run(args);
        if (typeof get === "string")
            await message.channel.send(get);
        else
            await message.channel.send({ embeds: get });
    }
});
exports.default = disagree;
//# sourceMappingURL=disagree.js.map