"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const recommend_1 = require("../../services/recommend");
const discord_js_1 = require("discord.js");
const run = async (args) => {
    const embed = new _library_1.MyEmbedBuilder();
    const recommend = await recommend_1.RecommendService.getRandomRecommend();
    embed
        .setTitle(recommend.title)
        .setDescription(recommend.description);
    if (recommend.imgUrl)
        embed.setThumbnail(recommend.imgUrl);
    if (recommend.link)
        embed.setURL(recommend.link);
    if (recommend.category)
        embed.setFooter({ text: `category: ${recommend.category.join(", ")}` });
    return { embeds: [embed] };
};
const slashCommand = new discord_js_1.SlashCommandBuilder().setName("recommend")
    .setDescription("Recommends a random stuff")
    .addStringOption(opt => opt
    .setName("tag")
    .setDescription("The tag of the recommend")
    .setRequired(false));
const yomama = new _library_1.CommandBuilder()
    .setName("recommend")
    .setDescription("Recommend a random thing")
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const tag = interaction.options.getString("tag");
        return {
            tag
        };
    },
    interact: async (interaction, args) => {
        const embeds = await run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await interaction.reply({
            embeds: embeds.embeds,
            files: embeds.files
        });
    }
})
    .setChat({
    execute: async (message, args) => {
        const embeds = await run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        message.channel.send(embeds);
    },
});
exports.default = yomama;
//# sourceMappingURL=recommend.js.map