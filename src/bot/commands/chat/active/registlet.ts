import { BOT_PREFIXES } from "@config";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { registlet } from "@services/discord/registlet";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "registlet",
    alias: ["regi", "reg", "regis"],
    description: "Search registlet by name",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} registlet <name>`,
            description: "Searches for registlet with the given name"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const name = ctx.args.join(" ");
    debug(`searching registlet with name: ${name}`);

    const embeds = await registlet({name});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;