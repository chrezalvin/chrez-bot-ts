"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const cursed_1 = require("../../services/cursed");
const run = async (message, args) => {
    const cursedListLength = cursed_1.CursedService.getCursedList().length;
    if (args === undefined)
        throw new Error("no argument provided");
    if (message.channel)
        if (message.channel.type === discord_js_1.ChannelType.GuildText)
            if (!message.channel.nsfw)
                return new _library_1.ErrorValidation("command_restricted", "cursed image", "age restricted channel");
    if (args.index >= cursedListLength)
        return new _library_1.ErrorValidation("index_out_of_bounds", 0, cursedListLength - 1);
    if (args.index < 0)
        return new _library_1.ErrorValidation("index_negative");
    const cursedUrl = await cursed_1.CursedService.getCursedUrl(args.index);
    const embed = new _library_1.MyEmbedBuilder({ title: `cursed #${args.index}` }).setImage(cursedUrl);
    return [embed];
};
;
const cursed = new _library_1.CommandBuilder({
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        { command: `${_config_1.prefixes[0]} curse`, description: "give random cursed image" },
        { command: `${_config_1.prefixes[0]} curse 19`, description: "give cursed image #19" }
    ],
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("cursed")
            .setDescription("Sends you a really cursed image")
            .addIntegerOption(opt => opt
            .setName("index")
            .setDescription("Index to specify which cursed image you want to see")
            .setMinValue(0)),
        interact: async (interaction, args) => {
            await interaction.deferReply();
            const embeds = await run(interaction, args);
            if (_library_1.ErrorValidation.isErrorValidation(embeds))
                return embeds;
            await interaction.editReply({ embeds });
        },
        getParameter(interaction) {
            const index = interaction.options.getInteger("index", false) ?? (0, _library_1.rngInt)(0, cursed_1.CursedService.getCursedList().length - 1);
            return { index };
        }
    },
    chat: {
        execute: async (message, args) => {
            const embeds = await run(message, args);
            if (_library_1.ErrorValidation.isErrorValidation(embeds))
                return embeds;
            await message.channel.send({ embeds });
        },
        getParameter(_, args) {
            let index = (0, _library_1.rngInt)(0, cursed_1.CursedService.getCursedList().length - 1);
            if (args.length != 0) {
                let num = parseInt(args[0]);
                if (!isNaN(num))
                    index = num;
            }
            return { index };
        }
    },
    status: "public",
});
exports.default = cursed;
//# sourceMappingURL=cursed.js.map