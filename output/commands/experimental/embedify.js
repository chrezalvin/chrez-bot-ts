"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../library/basicFunctions");
const discord_js_1 = require("discord.js");
const CommandBuilder_1 = require("../../library/CommandBuilder");
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
const embedify = new CommandBuilder_1.CommandBuilder()
    .setName("embedify")
    .setDescription("Creates an embed")
    .setSlash({
    slashCommand: slashCommand,
    getParameter: (interaction) => {
        const description = interaction.options.getString("description", true);
        const title = interaction.options.getString("title", false);
        const footer = interaction.options.getString("footer", false);
        const attachment = interaction.options.getAttachment("attachment", false);
        return {
            description,
            title,
            footer,
            attachment
        };
    },
    interact: async (interaction, args) => {
        if (!args)
            throw new Error("argument is not provided");
        const embed = new basicFunctions_1.MyEmbedBuilder({
            description: args.description,
            title: args.title ?? "\u200B",
        });
        if (args.footer)
            embed.setFooter({ text: args.footer });
        if (args.attachment)
            embed.setThumbnail(args.attachment.url);
        await interaction.reply({ embeds: [embed] });
    }
});
exports.default = embedify;
