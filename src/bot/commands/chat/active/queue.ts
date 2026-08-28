import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { queue } from "@services/discord/Music/queue";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "queue",
    alias: [],
    description: "shows the playlist",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await queue({
        voiceChannel: ctx.voiceChannel!
    });

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;