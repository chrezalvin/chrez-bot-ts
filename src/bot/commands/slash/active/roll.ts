import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { SlashCommandBuilder } from "discord.js";
import { roll } from "@services/discord/roll";
import { SlashCommand } from "@commands/types";

const slash = new SlashCommandBuilder().setName("roll")
    .setDescription("rolls a number between 2 numbers, rolls a die otherwise")
    .addIntegerOption(option => option.setName("first").setDescription("First Number"))
    .addIntegerOption(option => option.setName("second").setDescription("Second Number"));

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const first = ctx.interaction.options.getInteger("first", false);
    const second = ctx.interaction.options.getInteger("second", false);

    let embed;
    if((first && second))
        embed = await roll({first, second});
    else if((first === null && second === null))
        embed = await roll({first, second});
    else
        throw new Error("the first or second number should be inputted too");
    
    await ctx.interaction.reply(embed);
}

export default {slash, middlewares: [execute]} as SlashCommand;