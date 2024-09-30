"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const recommend_1 = require("../../services/recommend");
const run = async (args) => {
    if (!args)
        return new _library_1.ErrorValidation("no_argument_provided");
    try {
        const recommend = await recommend_1.RecommendService.createNewrecommend(args, args.imgUrl);
        const embed = new _library_1.MyEmbedBuilder();
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
    }
    catch (e) {
        console.log(e);
        return new _library_1.ErrorValidation("message_error");
    }
};
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("addrecommend")
    .setDescription("Recommends a random stuff")
    .addStringOption(opt => opt
    .setName("title")
    .setDescription("title of the recommend")
    .setRequired(true))
    .addStringOption(opt => opt
    .setName("description")
    .setDescription("description of the recommend")
    .setRequired(true))
    .addAttachmentOption(opt => opt
    .setName("thumbnail")
    .setDescription("The image thumbnail of the recommend")
    .setRequired(false))
    .addStringOption(opt => opt
    .setName("link")
    .setDescription("The link of the recommend")
    .setRequired(false))
    .addStringOption(opt => opt
    .setName("category")
    .setDescription("category of the recommend (use comma to separate) | ex: \"movie, anime\"")
    .setRequired(false));
const addrecommend = new _library_1.CommandBuilder()
    .setName("addrecommend")
    .setDescription("Recommend a random thing")
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const title = interaction.options.getString("title", true);
        const description = interaction.options.getString("description", true);
        const thumbnail = interaction.options.getAttachment("thumbnail", false);
        const link = interaction.options.getString("link", false);
        const category = interaction.options.getString("category", false)?.split(",").map((cat) => cat.trim());
        let data = {
            title,
            description,
        };
        if (thumbnail?.url)
            data.imgUrl = thumbnail.url;
        if (link)
            data.link = link;
        if (category)
            data.category = category;
        return data;
    },
    interact: async (interaction, args) => {
        await interaction.deferReply();
        const embeds = await run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await interaction.editReply({
            content: "new recommendation added, here's the embed preview",
            embeds: embeds.embeds,
            files: embeds.files
        });
    }
});
exports.default = addrecommend;
//# sourceMappingURL=addRecommend.js.map