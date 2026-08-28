import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { SlashCommandBuilder } from "discord.js";
import { story } from "@services/discord/story";
import { SlashCommand } from "@commands/types";

const slash = new SlashCommandBuilder()
        .setName("story")
        .setDescription("Creates a random story, you can specify which story you want using the option")
        .addIntegerOption(option => option.setName("index").setDescription("Index to target a story"));

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const index = ctx.interaction.options.getInteger("index", false);

    const embed = await story({index});

    await ctx.interaction.reply(embed);
}

export default {slash, middlewares: [execute]} as SlashCommand;