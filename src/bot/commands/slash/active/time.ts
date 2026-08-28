import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { SlashCommandBuilder } from "discord.js";
import { time } from "@services/discord/time";
import { SlashCommand } from "@commands/types";

const slash = new SlashCommandBuilder()
        .setName("time")
        .setDescription("Check the time in another country")
        .addStringOption(opt => opt.setName("keyword").setDescription("could be name, country, city, etc. Defaulted to japan time").setMinLength(2).setRequired(false))

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    let keyword = ctx.interaction.options.getString("keyword", false);

    if(keyword === "me")
        keyword = ctx.interaction.user.id;

    const embeds = await time({keyword: keyword ?? undefined});
    
    await ctx.interaction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;