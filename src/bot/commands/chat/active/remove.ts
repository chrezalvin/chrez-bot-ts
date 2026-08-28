import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { remove } from "@services/discord/Music/remove";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "remove",
    alias: [],
    description: "removes the specified song from the queue",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const index = parseInt(ctx.args[0]);

    const res = await remove({
        index, 
        voiceChannel: ctx.voiceChannel!
    });

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;