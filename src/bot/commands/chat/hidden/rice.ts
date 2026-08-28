import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { rice } from "@services/discord/rice";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "rice",
    alias: [],
    description: "Appreciates rice",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await rice({});

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;