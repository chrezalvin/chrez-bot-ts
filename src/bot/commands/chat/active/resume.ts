import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { resume } from "@services/discord/Music/resume";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "resume",
    alias: [],
    description: "resumes the current song",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await resume({
        voiceChannel: ctx.voiceChannel!
    });
    
    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;