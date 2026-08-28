import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { hug } from "@services/discord/hug";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "hug",
    alias: [],
    description: "gives hug",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await hug({});

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;