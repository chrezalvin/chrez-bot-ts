import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { resume } from "@services/discord/Music/resume";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";

const slash = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("resumes the current song");

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const voiceChannel = (ctx.interaction.member as GuildMember).voice.channel;

    if(!voiceChannel)
        throw new Error("You must be in a voice channel to use this command");

    const res = await resume({voiceChannel});

    await ctx.interaction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;