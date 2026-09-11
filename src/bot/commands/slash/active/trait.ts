import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { SlashCommandBuilder } from "discord.js";
import { trait } from "@services/discord/trait";
import { SlashCommand } from "@commands/types";

const slash = new SlashCommandBuilder()
        .setName("trait")
        .setDescription("Search trait by name")
        .addStringOption(option => 
            option.setName("name")
                .setDescription("The name of the trait")
                .setRequired(true)
        )

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const name = ctx.chatInteraction.options.getString("name", true);
    const embeds = await trait({name});

    await ctx.chatInteraction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;