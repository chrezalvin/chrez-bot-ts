"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const colorList = [
    "Default",
    "White",
    "Aqua",
    "Green",
    "Blue",
    "Yellow",
    "Purple",
    "Fuchsia",
    "Gold",
    "Orange",
    "Red",
    "Grey",
    "Navy",
    "LightGrey",
    "DarkNavy",
    "Blurple",
    "Greyple",
];
function isColorResolvable(color) {
    if (typeof color === "string")
        return colorList.includes(color);
    return false;
}
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("embedify")
    .setDescription("Creates an embed")
    .addStringOption(opt => opt.setName("description").setDescription("the description of the embed").setRequired(true))
    .addStringOption(opt => opt.setName("title").setDescription("title of the embed").setRequired(false))
    .addStringOption(opt => opt.setName("footer").setDescription("embed's footer").setRequired(false))
    .addAttachmentOption(opt => opt.setName("thumbnail").setDescription("the thumbnail photo of the embed").setRequired(false))
    .addAttachmentOption(opt => opt.setName("authorimage").setDescription("image of the author embed (left side of title)").setRequired(false))
    .addAttachmentOption(opt => opt.setName("footerimage").setDescription("image of the footer embed").setRequired(false))
    .addStringOption(opt => {
    for (const color of colorList)
        opt.addChoices({ name: color, value: color });
    opt
        .setName("color")
        .setDescription("the color label of the embed")
        .setRequired(false);
    return opt;
});
const embedify = new _library_1.CommandBuilder()
    .setName("embedify")
    .setMode("available")
    .setDescription("Creates an embed")
    .setSlash({
    slashCommand: slashCommand,
    getParameter: (interaction) => {
        const description = interaction.options.getString("description", true);
        const title = interaction.options.getString("title", false);
        const footer = interaction.options.getString("footer", false);
        const thumbnail = interaction.options.getAttachment("thumbnail", false);
        const authorimage = interaction.options.getAttachment("authorimage", false);
        const footerimage = interaction.options.getAttachment("footerimage", false);
        const color = interaction.options.getString("color", false);
        if (color && !isColorResolvable(color))
            throw new Error("color is not valid");
        return {
            description,
            title,
            footer,
            thumbnail,
            color: color,
            authorimage,
            footerimage,
        };
    },
    interact: async (interaction, args) => {
        if (!args)
            throw new Error("argument is not provided");
        const embed = new _library_1.MyEmbedBuilder()
            .setDescription(args.description);
        if (args.title)
            embed.setTitle(args.title);
        if (args.color)
            embed.setColor(args.color);
        if (args.footer)
            embed.setFooter({ text: args.footer, iconURL: args.footerimage?.url });
        if (args.thumbnail)
            embed.setThumbnail(args.thumbnail.url);
        if (args.authorimage)
            embed.setAuthor({ name: "\u200B", iconURL: args.authorimage.url });
        await interaction.reply({ embeds: [embed] });
    }
});
exports.default = embedify;
//# sourceMappingURL=embedify.js.map