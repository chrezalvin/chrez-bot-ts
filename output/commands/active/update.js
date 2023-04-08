"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const update_json_1 = __importDefault(require("../../assets/messages/active/update.json"));
const run = (message, args) => {
    let version = null;
    if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
        const version_hold = message.options.getString("version", false);
        if (version_hold !== null)
            version = version_hold;
    }
    else if (args && args[0] !== undefined)
        version = args[0];
    let update = update_json_1.default[update_json_1.default.length - 1];
    const embed = new basicFunctions_1.MyEmbedBuilder();
    if (version !== undefined) {
        const find = update_json_1.default.find(update => update.version === version);
        if (find === undefined)
            throw new Error(`version ${version} cannot be found!`);
        update = find;
    }
    embed.setTitle(`Chrezbot \`v${update.version}\` news and bugfixes`);
    if (update.news)
        embed.addFields({ name: "news", value: update.news.join("\n") });
    if (update.bugfix)
        embed.addFields({ name: "bugfix", value: update.bugfix.join("\n") });
    return embed;
};
const command = {
    name: "update",
    alias: ["u", "news"],
    description: "Gives you update about chrezbot (news and bugfixes)",
    execute: (message, args) => {
        const embed = run(message, args);
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("update")
            .setDescription("Gives you uppdate about ChrezBot (news and bugfixes)")
            .addStringOption(opt => {
            for (const update of update_json_1.default)
                opt.addChoices({ name: `v${update.version}`, value: update.version });
            opt.setName("version");
            opt.setDescription("Version to specify");
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
exports.default = command;
