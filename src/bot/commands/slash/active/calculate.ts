import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { CalculateService } from "@services/discord";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Calculates a math expression")
    .addStringOption(opt => opt.setName("expression")
    .setDescription("the expressions to calculate")
    .setRequired(true))

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const expression = ctx.interaction.options.getString("expression", true);
   
    const res = await CalculateService.calculate({
        expression
    });
    
    await ctx.interaction.reply(res);
}

export default {slash, middlewares: [execute]} as SlashCommand;