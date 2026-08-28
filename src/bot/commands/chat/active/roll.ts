import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { roll } from "@services/discord/roll";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "roll",
    alias: ["dice", "random", "rng"],
    description: "rolls a number between 2 numbers, rolls a die otherwise",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} roll`, 
            description: "rolls a dice"
        },
        {
            command: `${BOT_PREFIXES[0]} roll 1 20`, 
            description: "rolls a number between 1 and 20"
        },
        {
            command: `${BOT_PREFIXES[0]} roll 30 20`,
            description: "rolls a number between 30 and 20"
        },
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    // check if the first and second argument exist
    const a = parseInt(ctx.args[0]);
    const b = parseInt(ctx.args[1]);

    const embeds = await roll({first: a, second: b});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;