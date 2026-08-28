import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { repeat } from "@services/discord/Music/repeat";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";

const slash = new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Allows you to repeat the playlist")
    .addBooleanOption(option => option
        .setName("repeat")
        .setDescription("Repeats the playlist")
        .setRequired(false)
    );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const voiceChannel = (ctx.interaction.member as GuildMember).voice.channel;
    const isRepeat = ctx.interaction.options.getBoolean("repeat") ?? true;

    if(!voiceChannel)
        throw new Error("You must be in a voice channel to use this command");

    const res = await repeat({voiceChannel, repeat: isRepeat});

    await ctx.interaction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;