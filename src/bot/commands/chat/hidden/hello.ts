import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { hello } from "@services/discord/hello";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "hello",
    alias: [],
    description: "Says hello",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await hello({
        msg: "hi"
    });
    
    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;