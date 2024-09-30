"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const quote_json_1 = __importDefault(require("../../assets/messages/active/quote.json"));
const _config_1 = require("../../config");
const run = (args) => {
    let index = args?.index ?? (0, _library_1.rngInt)(0, quote_json_1.default.length - 1);
    if (index >= quote_json_1.default.length)
        return new _library_1.ErrorValidation("index_out_of_bounds", 0, quote_json_1.default.length - 1);
    if (index < 0)
        return new _library_1.ErrorValidation("index_negative");
    const embed = new _library_1.MyEmbedBuilder();
    const quote = quote_json_1.default[index];
    if (quote.memberRef) {
        const member = (0, _library_1.getProfileByID)(quote.memberRef);
        embed.setDescription(quote.description.join("\n"))
            .setAuthor({ name: quote.author, iconURL: `https://cdn.discordapp.com/avatars/${quote.memberRef}/${member?.avatarID}.webp` })
            .setFooter({ text: `quote #${index}` });
    }
    else {
        embed.setDescription(quote.description.join("\n"))
            .setTitle(`Quote #${index}`)
            .setFooter({ text: `this quote is made by ${quote.author}` });
    }
    return [embed];
};
;
const quote = new _library_1.CommandBuilder()
    .setName("quote")
    .setAlias(["q"])
    .setDescription("Creates a random quote")
    .setExamples([
    { command: `${_config_1.prefixes[0]} quote`, description: "give random quote" },
    { command: `${_config_1.prefixes[0]} quote 19`, description: "give quote #19" }
])
    .setSlash({
    slashCommand: new discord_js_1.SlashCommandBuilder().setName("quote")
        .setDescription("Creates a random quote, you can specify which quote you want using the option")
        .addIntegerOption(option => option
        .setName("index")
        .setDescription("Index to target a quote")
        .setMinValue(0)
        .setMaxValue(quote_json_1.default.length - 1)),
    interact: async (interaction, args) => {
        const embeds = run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await interaction.reply({ embeds });
    },
    getParameter(interaction) {
        const getOpt = interaction.options.getInteger("index", false) ?? (0, _library_1.rngInt)(0, quote_json_1.default.length - 1);
        return { index: getOpt };
    }
})
    .setChat({
    getParameter(_, args) {
        let index = (0, _library_1.rngInt)(0, quote_json_1.default.length - 1);
        if (args && !isNaN(parseInt(args[0])))
            index = parseInt(args[0]);
        return { index };
    },
    execute: async (message, args) => {
        const embeds = run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await message.channel.send({ embeds });
    },
});
exports.default = quote;
//# sourceMappingURL=quote.js.map