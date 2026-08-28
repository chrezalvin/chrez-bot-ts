import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { stop } from "@services/discord/Music/stop";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "stop",
    alias: [],
    description: "Stops all the songs in the queue",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await stop({
        voiceChannel: ctx.voiceChannel!
    });

    await ctx.message.reply(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;