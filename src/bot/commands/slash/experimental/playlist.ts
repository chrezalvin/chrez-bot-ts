import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "@commands/types";
import { slashMiddleware } from "@bot/commandMiddlewares";
import { I_Playlist, playlist } from "@services/discord/Music/playlist";

const slash = new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Save or view your playlist, you can specify which playlist you want using the option")
        .addStringOption(option => option
            .setName("options")
            .setDescription("Options to manage your playlist")
            .setRequired(true)
            .addChoices([
                {name: "play", value: "play"},
                {name: "view", value: "view"},
                {name: "save", value: "save"},
                {name: "remove", value: "remove"},
                {name: "update", value: "update"},
            ])
        )
        .addStringOption(option => option
            .setName("name")
            .setRequired(false)
            .setDescription("Name of the playlist")
        );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const voiceChannel = (ctx.interaction.member as GuildMember).voice.channel;
    const avatarUrl = ctx.interaction.user.displayAvatarURL();
    const name = ctx.interaction.user.username;

    const options = ctx.interaction.options.getString("options", true) as I_Playlist["options"];
    const playlistName = ctx.interaction.options.getString("name", false) ?? undefined;

    await ctx.interaction.deferReply();
    const embeds = await playlist({
        message: ctx.interaction,
        options, 
        playlistName,
        voiceChannel,
        requester: { 
            name,
            iconUrl: avatarUrl 
        }
    });

    await ctx.interaction.editReply({content: embeds.content, embeds: embeds.embeds});
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireVC(), 
        execute
    ]
} as SlashCommand;