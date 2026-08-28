import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { BOT_PREFIXES } from "@config";
import { yomama } from "@services/discord/yomama";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "yomama",
    alias: ["yo", "mama"],
    description: "Creates a random yo mama joke",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} yomama`, 
            description: "give random yo mama joke"
        },
        {
            command: `${BOT_PREFIXES[0]} yomama 19`, 
            description: "give yo mama jokes #19"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let index = undefined;
    if(ctx.args[0] !== undefined){
        if(!isNaN(parseInt(ctx.args[0])))
            index = parseInt(ctx.args[0]);
    }

    const embeds = await yomama({index});

    ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;