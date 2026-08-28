import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { cursed } from "@services/discord/cursed";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} curse`, 
            description: "give random cursed image"
        },
        {
            command: `${BOT_PREFIXES[0]} curse 19`, 
            description: "give cursed image #19"
        },
    ],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let index = undefined;

    if(ctx.args.length != 0){
        let num = parseInt(ctx.args[0]);
        if(!isNaN(num))
            index = num;
    }

    const embeds = await cursed({index, message: ctx.message});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;