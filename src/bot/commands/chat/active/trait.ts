import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { trait } from "@services/discord/trait";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:registlet");

const chat = new ChatCommandBuilder({
    name: "trait",
    alias: ["traits"],
    description: "Search trait by name",
    examples: [
        {
            command: "Chrez trait <name>",
            description: "Searches for trait with the given name"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const embeds = await trait({name: ctx.args.join(" ")});
    
    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;