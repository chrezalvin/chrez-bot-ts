import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { CraftingService } from "@services/discord";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
        .setName("crafting")
        .setDescription("Recommends crafts to make based on your current profiency level and difficulty")
        .addIntegerOption(option => 
            option
            .setName("profiency_level")
            .setDescription("your current profiency level")
            .setMinValue(0)
            .setMaxValue(320)
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option
            .setName("difficulty")
            .setDescription("maximum difficulty of the crafts to recommend")
            .setMinValue(1)
            .setMaxValue(520)
        );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const profiency = ctx.interaction.options.getInteger("profiency_level", true);
    const difficulty = ctx.interaction.options.getInteger("difficulty", false) || undefined;

    const res = await CraftingService.crafting({
        profiency,
        difficulty
    });

    await ctx.interaction.reply(res);
}

export default {slash, middlewares: [execute]} as SlashCommand;