import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { ChatCommand } from "@commands/types";
import { EnemyService } from "@services/discord";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "enemy",
    alias: ["e", "mob", "monster"],
    description: "Searches toram mob",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} mob adaro`, 
            description: "give info about enemy named \"adaro\""
        }
    ],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const embeds = await EnemyService.enemy({name: ctx.args.join(" ")});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;