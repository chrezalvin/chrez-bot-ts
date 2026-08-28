import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { remove } from "@services/discord/Music/remove";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";

const slash = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("removes the specified song from the queue")
    .addIntegerOption((option) => option.setName("index").setDescription("The index of the song to be removed").setRequired(true));

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const index = ctx.interaction.options.getInteger("index", true);

    const voiceChannel = (ctx.interaction.member as GuildMember).voice.channel;

    if(!voiceChannel)
        throw new Error("You must be in a voice channel to use this command");

    const res = await remove({index, voiceChannel});

    await ctx.interaction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;