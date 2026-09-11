import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { skip } from "@services/discord/Music/skip";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";

const slash = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song");

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const voiceChannel = (ctx.chatInteraction.member as GuildMember).voice.channel;

    if(!voiceChannel)
        throw new Error("You must be in a voice channel to use this command");

    const res = await skip({voiceChannel});

    await ctx.chatInteraction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;