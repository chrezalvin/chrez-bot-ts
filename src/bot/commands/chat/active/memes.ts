import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { memes } from "@services/discord/memes";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "meme",
    alias: ["memes"],
    description: "Sends you a meme",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} meme`, 
            description: "give random meme"
        },
        {
            command: `${BOT_PREFIXES[0]} meme 19`, 
            description: "give meme #19"
        },
    ],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let nsfw: boolean = false;
    let index: number | undefined = undefined;

    // possible args:
    // Chrez meme 16 nsfw
    // Chrez meme nsfw 16
    // Chrez meme nsfw
    // Chrez meme 16
    ctx.args.find((arg) => arg === "nsfw" ? nsfw = true : false);
    ctx.args.find((arg) => {
        const num = parseInt(arg);
        if(!isNaN(num)){
            index = num;
            return true;
        }
        return false;
    });

    const embeds = await memes({
        index, 
        message: ctx.message,
        nsfw
    });

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;