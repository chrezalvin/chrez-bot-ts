import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { quote } from "@services/discord/quote";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "quote",
    alias: ["q"],
    description: "Creates a random quote",
    examples: [
        {command: `${BOT_PREFIXES[0]} quote`, description: "give random quote"},
        {command: `${BOT_PREFIXES[0]} quote 19`, description: "give quote #19"}
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let index: number | undefined = undefined;
    if(!isNaN(parseInt(ctx.args[0])))
        index = parseInt(ctx.args[0]);

    const embeds = await quote({index});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;