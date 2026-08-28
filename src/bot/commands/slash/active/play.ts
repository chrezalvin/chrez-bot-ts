import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { play } from "@services/discord/Music/play";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";

const slash = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Searches for a song then plays it on voice channel")
    .addStringOption((input) => input
        .setName("search")
        .setDescription("the search term")
        .setRequired(true)
    );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const query = ctx.interaction.options.getString("search", true);

    const voiceChannel = (ctx.interaction.member as GuildMember).voice.channel;
    const avatarUrl = ctx.interaction.user.displayAvatarURL();
    const name = ctx.interaction.user.username;

    if(!voiceChannel)
        throw new Error("You need to be in a voice channel to play music");

    const res = await play({
        message: ctx.interaction,
        query,
        voiceChannel,
        requester: {name, iconUrl: avatarUrl}
    });

    await ctx.interaction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;