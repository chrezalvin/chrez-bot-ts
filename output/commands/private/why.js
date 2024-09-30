"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const why_json_1 = __importDefault(require("../../assets/messages/private/why.json"));
const _services_1 = require("../../services");
const run = async (args) => {
    if (!args)
        return "I don't know why you're asking me this.";
    const user = await _services_1.UserService.getUser(args.discordId);
    const pickWhy = user.rolename == "user" ? "normal" : "exclusive";
    const why = why_json_1.default[pickWhy][(0, _library_1.rngInt)(0, why_json_1.default[pickWhy].length - 1)];
    const embed = new _library_1.MyEmbedBuilder({
        title: why.title,
        description: why
            .description
            .replace("[name]", user.username)
            .replace("[role]", user.rolename),
        footer: { text: why.footer }
    });
    return { embeds: [embed] };
};
const slashCommand = new discord_js_1.SlashCommandBuilder().setName("why").setDescription("Answering the real question");
const why = new _library_1.CommandBuilder()
    .setName("why")
    .setDescription("Answering the real question")
    .setAlias(["y"])
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        return {
            discordId: interaction.user.id
        };
    },
    interact: async (interaction, args) => {
        const res = await run(args);
        await interaction.reply(res);
    }
})
    .setChat({
    getParameter: (message, args) => {
        return {
            discordId: message.author.id
        };
    },
    execute: async (message, args) => {
        const res = await run(args);
        await message.channel.send(res);
    }
});
exports.default = why;
//# sourceMappingURL=why.js.map