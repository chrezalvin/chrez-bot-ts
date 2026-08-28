import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { play } from "@services/discord/Music/play";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "play",
    alias: ["p", "pl", "vc"],
    description: "Searches for a song then plays it on voice channel",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} play bohemian raphsody`, 
            description: "plays bohemian raphsody"
        },
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const query = ctx.args.join(" ");

    const avatarUrl = ctx.message.author.displayAvatarURL();
    const name = ctx.message.author.username;

    const res = await play({
        message: ctx.message,
        query,
        requester: {
            name,
            iconUrl: avatarUrl
        },
        voiceChannel: ctx.voiceChannel!
    });

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;