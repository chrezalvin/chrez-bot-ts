import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { pause } from "@services/discord/Music/pause";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "pause",
    alias: [],
    description: "Pauses the current song",
    examples: [
        {
            command: "Chrez pause", 
            description: "pauses the current song"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await pause({
        voiceChannel: ctx.voiceChannel!
    });

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;