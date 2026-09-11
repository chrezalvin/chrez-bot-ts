import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { why } from "@services/discord/private";
import { slashMiddleware } from "@bot/commandMiddlewares";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
    .setName("why")
    .setDescription("Answering the real question");

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const discordId = ctx.chatInteraction.user.id;
    const res = await why({discordId});

    await ctx.chatInteraction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireDiscordUser({
            roles: ["owner"]
        }), 
        execute
    ]
} as SlashCommand;