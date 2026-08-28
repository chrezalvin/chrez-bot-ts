import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { repeat } from "@services/discord/Music/repeat";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "repeat",
    alias: [],
    description: "Allows you to repeat the playlist",
    examples: [
        {
            command: "Chrez Repeat", 
            description: "Repeats the current playlist"
        },
        {
            command: "Chrez Repeat false", 
            description: "Stops repeating the current playlist"
        },
        {
            command: "Chrez Repeat true", 
            description: "Repeats the current playlist"
        },
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const isRepeat = ctx.args[0] === "false" ? false : true;

    const res = await repeat({
        voiceChannel: ctx.voiceChannel!, 
        repeat: isRepeat
    });

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [chatMiddleware.requireVC(), execute]} as ChatCommand;