import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { unmute } from "@services/discord/private";
import { slashMiddleware } from "@bot/commandMiddlewares";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("unmutes chrezbot");

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const res = unmute({});

    await ctx.chatInteraction.reply(res);
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