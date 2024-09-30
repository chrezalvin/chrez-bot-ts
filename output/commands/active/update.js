"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("ChrezBot:update");
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const update_json_1 = __importDefault(require("../../assets/messages/active/update.json"));
const _config_1 = require("../../config");
const update_1 = require("../../services/update");
function customFieldMaker(title, list) {
    return {
        name: title,
        value: list.join("\n")
    };
}
const run = async (version) => {
    // defaulted to latest version
    // let version: string = args?.version ?? botVersion;
    const update = await update_1.UpdateService.getUpdate(version);
    const embed = new _library_1.MyEmbedBuilder();
    embed.setTitle(`Chrezbot \`v${update.version}\` news and bugfixes`);
    if (update.news)
        embed.addFields(customFieldMaker("news", update.news));
    if (update.bugfix)
        embed.addFields(customFieldMaker("bugfix", update.bugfix));
    return [embed];
};
const update = new _library_1.CommandBuilder()
    .setName("update")
    .setAlias(["u", "news"])
    .setDescription("Gives you update about chrezbot (news and bugfixes)")
    .setExamples([
    { command: `${_config_1.prefixes[0]} update`, description: "give latest update" },
    { command: `${_config_1.prefixes[0]} update 1.1.0`, description: "give update 1.1.0" }
])
    .setSlash({
    slashCommand: new discord_js_1.SlashCommandBuilder().setName("update")
        .setDescription("Gives you update about ChrezBot (news and bugfixes)")
        .addStringOption(opt => {
        for (const update of update_json_1.default)
            opt.addChoices({ name: `v${update.version}`, value: update.version });
        opt.setName("version");
        opt.setDescription("Version to specify");
        return opt;
    }),
    getParameter: (interaction) => {
        const version = interaction.options.getString("version", false) ?? _config_1.botVersion;
        return { version };
    },
    interact: async (interaction, args) => {
        if (!args)
            return new _library_1.ErrorValidation("no_argument_provided");
        const embeds = await run(args.version);
        await interaction.reply({ embeds });
    }
})
    .setChat({
    getParameter: (_, args) => {
        let version = _config_1.botVersion;
        if (args && args[0] !== undefined)
            version = args[0];
        return { version };
    },
    execute: async (message, args) => {
        if (!args)
            return new _library_1.ErrorValidation("no_argument_provided");
        const embeds = await run(args.version);
        message.channel.send({ embeds });
    },
});
exports.default = update;
//# sourceMappingURL=update.js.map