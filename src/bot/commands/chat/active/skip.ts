import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { skip } from "@services/discord/Music/skip";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "skip",
    alias: ["s"],
    description: "Skips the current song",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await skip({
        voiceChannel: ctx.voiceChannel!
    });

    await ctx.message.reply(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;