import { BOT_PREFIXES } from "@config";
import { ErrorValidation, rngInt } from "@library";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { levelling } from "@services/discord/levelling";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "levelling",
    alias: ["lvl", "lvling", "leveling", "farm", "lv", "level"],
    description: "Recommends mobs to farm for levelling up, based on your current level",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} levelling 100`, 
            description: "recommend mobs to farm for level 100"
        },
    ],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let lvl: number | undefined = undefined;
    if(!isNaN(parseInt(ctx.args[0])))
        lvl = parseInt(ctx.args[0]);

    if(!lvl)
        throw new ErrorValidation("something_not_found", "level");

    if(lvl < 1 || lvl > 400)
        throw new ErrorValidation("index_out_of_bounds", 1, 400);

    const embeds = await levelling({lvl});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;