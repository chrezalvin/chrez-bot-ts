import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { levelling } from "@services/discord/levelling";
import { bulkDelete } from "@services/discord/private";
import { slashMiddleware } from "@bot/commandMiddlewares";
import { SlashCommand } from "@commands/types";
import { ChannelType, Message, SlashCommandBuilder } from "discord.js";

const messageTimeout = 10;

const slash = new SlashCommandBuilder()
        .setName("bulkdelete")
        .setDescription("Delete multiple messages at once")
        .addIntegerOption(opt => opt
            .setName("amount")
            .setDescription("Amount of messages to delete")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
        )
        .addChannelOption(opt => opt
            .setName("channel")
            .setDescription("Channel to delete the message")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const amount = ctx.chatInteraction.options.getInteger("amount", true);
    const channel = ctx.chatInteraction.options.getChannel("channel", false) ?? ctx.chatInteraction.channel;

    if(!channel) throw new Error("Channel is not provided");
    if(channel.type !== ChannelType.GuildText) throw new Error("Channel must be a text based channel");

    await ctx.chatInteraction.deferReply();

    const embed = await bulkDelete({
        amount,
        channel: channel as any, // TODO
        filterMessage: (msg: Message<boolean>) => {
            return msg.id !== ctx.chatInteraction.id;
        },
        message: ctx.chatInteraction,
        messageTimeout
    });

    await ctx.chatInteraction.editReply({embeds: embed.embeds});

    setTimeout(async () => {
        await ctx.chatInteraction.deleteReply();
    }, messageTimeout * 1000);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireDiscordUser({
            roles: ["owner", "vice", "admin"]
        }), 
        execute
    ]
} as SlashCommand;