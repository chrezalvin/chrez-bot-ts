import { rngInt } from "@library";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { cursed } from "@services/discord/cursed";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";
import { CursedView } from "@services/supabase/services";

const slash = new SlashCommandBuilder()
        .setName("cursed")
        .setDescription("Sends you a really cursed image")
        .addIntegerOption(opt => opt
            .setName("index")
            .setDescription("Index to specify which cursed image you want to see")
            .setMinValue(0))

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const index = ctx.interaction.options.getInteger("index", false) ?? rngInt(0, CursedView.getCursedLength() - 1);

    await ctx.interaction.deferReply();
    const embeds = await cursed({
        message: ctx.interaction,
        index
    });

    await ctx.interaction.editReply({
        embeds: embeds.embeds
    });
}

export default {slash, middlewares: [execute]} as SlashCommand;