import { MyEmbedBuilder } from "@library";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { setMute } from "@services/discord/private";
import { slashMiddleware } from "@bot/commandMiddlewares";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
    .setName("mute")
    .setDescription("mutes chrezbot")
    .addBooleanOption(input => input.setName("global")
        .setDescription("if this is true, chrezbot will be muted for all users")
        .setRequired(false)
    )
    .addNumberOption(input => input.setName("duration")
        .setDescription("how long chrezbot will be muted in minutes (20 minutes if left empty)")
        .setRequired(false)
    );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const mute = ctx.chatInteraction.options.getBoolean("mute", true);
    const onUnmuted = () => {
        if(ctx.chatInteraction.channel?.isSendable())
            ctx.chatInteraction.channel?.send({
                embeds: [new MyEmbedBuilder({description: "Chrezbot is now unmuted"})]
            });
    }

    const res = setMute({mute}, onUnmuted);

    await ctx.chatInteraction.reply(res);
}

export default {
    slash, 
    middlewares: [
        slashMiddleware.requireDiscordUser({
            roles: ["owner", "vice", "admin"]
        }), 
        execute
    ]
} as SlashCommand;