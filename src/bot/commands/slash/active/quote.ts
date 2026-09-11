import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { quote } from "@services/discord/quote";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Creates a random quote, you can specify which quote you want using the option")
        .addIntegerOption(option => 
            option
            .setName("index")
            .setDescription("Index to target a quote")
        )

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const index = ctx.chatInteraction.options.getInteger("index", false);
    const embeds = await quote({
        index: index ?? undefined, 
    });

    await ctx.chatInteraction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;