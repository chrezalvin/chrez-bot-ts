import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { laugh } from "@services/discord/laugh";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "laugh",
    alias: ["haha", "l", "laughs", "heh"],
    description: "laughs at you",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await laugh({});

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;