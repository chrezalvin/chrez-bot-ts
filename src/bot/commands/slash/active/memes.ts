import { rngInt } from "@library";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { memes } from "@services/discord/memes";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";
import { MemeView } from "@services/supabase/services";

const slash = new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Sends you a meme")
    .addIntegerOption(opt => opt
        .setName("index")
        .setDescription("Index to specify which memes you want to see")
        .setMinValue(0)
    )
    .addBooleanOption(opt => opt
        .setName("nsfw")
        .setDescription("(TODO) set if you want nsfw memes, defaults to sfw")
    )

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const sfw_memes_length = MemeView.getMemeLength(false);
    const nsfw_memes_length = MemeView.getMemeLength(true);

    const nsfw = ctx.interaction.options.getBoolean("nsfw", false) ?? false;
    const index = ctx.interaction.options.getInteger("index", false) ?? rngInt(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);

    await ctx.interaction.deferReply();
    const embeds = await memes({
        index, 
        nsfw,
        message: ctx.interaction
    });

    await ctx.interaction.editReply({embeds:  embeds.embeds});
}

export default {slash, middlewares: [execute]} as SlashCommand;