import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { cry } from "@services/discord/cry";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "cry",
    alias: ["cries", "crys"],
    description: "Cries to chat",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await cry({});

    await ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;