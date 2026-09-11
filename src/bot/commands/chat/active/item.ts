import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { ChatCommand } from "@commands/types";
import { ItemService } from "@services/discord";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "item",
    alias: ["i"],
    description: "Searches toram item",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} item adaro`, 
            description: "give info about item named \"adaro\""
        }
    ],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const embeds = await ItemService.item({name: ctx.args.join(" ")});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;