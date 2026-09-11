import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { levelling } from "@services/discord/levelling";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder().setName("levelling")
    .setDescription("Recommends mobs to farm for levelling up, based on your current level")
    .addIntegerOption(option => 
        option
        .setName("level")
        .setDescription("Level to recommend mobs for")
        .setMinValue(1)
        .setMaxValue(400)
        .setRequired(true)
    )

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const lvl = ctx.chatInteraction.options.getInteger("level", true);

    const embeds = await levelling({lvl});

    await ctx.chatInteraction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;