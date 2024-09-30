"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const messageTimeout = 10;
async function run(message, args) {
    if (!args)
        throw new Error("Argument is not provided!");
    // check if the message sent is from a guild
    if (!message.guild)
        throw new Error("Unknown guild ID");
    if (!message.guild.members.me)
        throw new Error("Bot is not in the guild");
    if (!message.guild.members.me.permissions.has("ManageMessages"))
        throw new Error("Chrezbot doesn't have permission to delete in this channel!");
    if (args.amount > 100)
        throw new Error("The maximum messages to delete is 100");
    else if (args.amount <= 0)
        throw new Error("The amount to delete must be greater than 0");
    // fetch the message from the channel
    const messages = await args.channel.messages.fetch({ limit: args.amount + 1 });
    // delete messages except for the command reply
    const filtered = messages.filter(args.filterMessage);
    const res = await args.channel.bulkDelete(filtered, true);
    if (res === undefined)
        throw new Error("Failed to delete message!");
    const embed = new _library_1.MyEmbedBuilder()
        .setTitle("delete messages")
        .setDescription(`successfully deleted ${res.size} messages`)
        .setFooter({ text: `This message will be deleted in ${messageTimeout} seconds` });
    return { embeds: [embed] };
}
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("bulkdelete")
    .setDescription("Delete multiple messages at once")
    .addIntegerOption(opt => opt
    .setName("amount")
    .setDescription("Amount of messages to delete")
    .setMinValue(0)
    .setMaxValue(100)
    .setRequired(true))
    .addChannelOption(opt => opt
    .setName("channel")
    .setDescription("Channel to delete the message")
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setRequired(false));
const bulkDelete = new _library_1.CommandBuilder()
    .setName("bulkdelete")
    .setDescription("delete messages based on how much you put")
    .setExamples([
    {
        command: "Chrez bulkdelete 5",
        description: "Deletes 5 messages"
    }
])
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const amount = interaction.options.getInteger("amount", true);
        const channel = interaction.options.getChannel("channel", false) ?? interaction.channel;
        if (!channel)
            throw new Error("Channel is not provided");
        if (channel.type !== discord_js_1.ChannelType.GuildText)
            throw new Error("Channel must be a text based channel");
        return {
            amount,
            channel: channel,
            filterMessage: (message) => {
                return message.interaction?.id !== interaction.id;
            }
        };
    },
    interact: async (interaction, args) => {
        await interaction.deferReply();
        const embed = await run(interaction, args);
        await interaction.editReply(embed);
        setTimeout(async () => {
            await interaction.deleteReply();
        }, messageTimeout * 1000);
    }
})
    .setChat({
    getParameter: (message, args) => {
        const channel = message.mentions.channels.first() ?? message.channel;
        const amount = parseInt(args[0]);
        if (isNaN(amount))
            throw new Error("Argument is not a number");
        if (!channel.isTextBased())
            throw new Error("Channel must be a text based channel");
        return {
            amount,
            channel,
            filterMessage: (msg) => {
                return msg.id !== message.id;
            }
        };
    },
    execute: async (message, args) => {
        const res = await run(message, args);
        const msg = await message.channel.send(res);
        setTimeout(async () => {
            if (msg.deletable)
                await msg.delete();
        }, messageTimeout * 1000);
    }
});
exports.default = bulkDelete;
//# sourceMappingURL=bulkdelete.js.map