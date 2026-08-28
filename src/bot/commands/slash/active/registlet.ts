import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { SlashCommandBuilder } from "discord.js";
import { registlet } from "@services/discord/registlet";
import { SlashCommand } from "@commands/types";

const slash = new SlashCommandBuilder()
        .setName("registlet")
        .setDescription("Search registlet by name")
        .addStringOption(option => 
            option.setName("name")
                .setDescription("The name of the registlet")
                .setRequired(true)
                .setMinLength(2)
        )

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const name = ctx.interaction.options.getString("name", true);
    const embeds = await registlet({name});

    await ctx.interaction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;