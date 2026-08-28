import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { update } from "@services/discord/update";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "update",
    alias: ["u", "news"],
    description: "Gives you update about chrezbot (news and bugfixes)",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} update`, 
            description: "give latest update"
        },
        {
            command: `${BOT_PREFIXES[0]} update 1.1.0`, 
            description: "give update 1.1.0"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const embeds = await update({
        version: ctx.args[0]
    });

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;