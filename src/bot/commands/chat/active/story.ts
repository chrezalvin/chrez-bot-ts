import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { story } from "@services/discord/story";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "story",
    alias: ["s"],
    description: "Creates a random story",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} story`,
            description: "give random story"
        },
        {
            command: `${BOT_PREFIXES[0]} story 3`, 
            description: "give story #3"
        },
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const idx = ctx.args ? parseInt(ctx.args[0]) : undefined;

    const res = await story({index: idx});

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;