"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const _services_1 = require("../../services");
const run = async (message, args) => {
    const sfw_memes_length = _services_1.MemeService.fileManagerSfw.cache.length;
    const nsfw_memes_length = _services_1.MemeService.fileManagerNsfw.cache.length;
    const nsfw = args?.nsfw ?? false;
    let index = args?.index ?? (0, _library_1.rngInt)(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);
    // checks if the channel is nsfw
    if (nsfw) {
        if (message.channel) {
            if (message.channel.type === discord_js_1.ChannelType.GuildText && !message.channel.nsfw)
                return new _library_1.ErrorValidation("command_restricted", "nsfw meme", "age restricted channel");
            else if (message.channel.type === discord_js_1.ChannelType.DM) {
                // continue
            }
            else
                return new _library_1.ErrorValidation("command_restricted", "nsfw meme", "DM or nsfw channel");
        }
        else
            throw new Error("interaction received is not within a valid channel");
    }
    // checks for out of bounds error
    if (index < 0)
        return new _library_1.ErrorValidation("index_negative");
    if (nsfw && index >= nsfw_memes_length)
        return new _library_1.ErrorValidation("index_out_of_bounds", 0, nsfw_memes_length - 1);
    else if (index >= sfw_memes_length)
        return new _library_1.ErrorValidation("index_out_of_bounds", 0, sfw_memes_length - 1);
    const url = await _services_1.MemeService.getMemeUrl(nsfw, index);
    const embed = new _library_1.MyEmbedBuilder({ title: `meme#${index}` }).setImage(url);
    return [embed];
};
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("meme")
    .setDescription("Sends you a meme")
    .addIntegerOption(opt => opt
    .setName("index")
    .setDescription("Index to specify which memes you want to see")
    .setMinValue(0))
    .addBooleanOption(opt => opt
    .setName("nsfw")
    .setDescription("(TODO) set if you want nsfw memes, defaults to sfw"));
const memes = new _library_1.CommandBuilder()
    .setName("meme")
    .setAlias(["memes"])
    .setDescription("Sends you a meme")
    .setStatus("public")
    .setMode("available")
    .setExamples([
    { command: `${_config_1.prefixes[0]} meme`, description: "give random meme" },
    { command: `${_config_1.prefixes[0]} meme 19`, description: "give meme #19" }
])
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const sfw_memes_length = _services_1.MemeService.fileManagerSfw.cache.length;
        const nsfw_memes_length = _services_1.MemeService.fileManagerNsfw.cache.length;
        const nsfw = interaction.options.getBoolean("nsfw", false) ?? false;
        const index = interaction.options.getInteger("index", false) ?? (0, _library_1.rngInt)(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);
        return { index, nsfw };
    },
    interact: async (interaction, args) => {
        await interaction.deferReply();
        const embeds = await run(interaction, args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await interaction.editReply({ embeds });
    },
})
    .setChat({
    getParameter: (_, args) => {
        let nsfw = false;
        let index = -1;
        const sfw_memes_length = _services_1.MemeService.fileManagerSfw.cache.length;
        const nsfw_memes_length = _services_1.MemeService.fileManagerNsfw.cache.length;
        // possible args:
        // Chrez meme 16 nsfw
        // Chrez meme nsfw 16
        // Chrez meme nsfw
        // Chrez meme 16
        args.find((arg) => arg === "nsfw" ? nsfw = true : false);
        args.find((arg) => {
            const num = parseInt(arg);
            if (!isNaN(num)) {
                index = num;
                return true;
            }
            return false;
        });
        if (index === -1)
            index = (0, _library_1.rngInt)(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);
        return { index, nsfw };
    },
    execute: async (message, args) => {
        const embeds = await run(message, args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await message.channel.send({ embeds });
    },
});
exports.default = memes;
//# sourceMappingURL=memes.js.map