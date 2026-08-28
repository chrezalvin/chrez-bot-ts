import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { ErrorValidation } from "@library";
import { pause } from "@services/discord/Music/pause";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";

const slash = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song");

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    if(!ctx.interaction.guildId)
        throw new ErrorValidation("something_not_found", "guild id");

    const voiceChannel = (ctx.interaction.member as GuildMember).voice.channel;

    if(!voiceChannel)
        throw new ErrorValidation("forbidden", "you must be in a voice channel to use this command");

    const res = await pause({voiceChannel});

    await ctx.interaction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;