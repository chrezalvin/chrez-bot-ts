import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { disagree } from "@services/discord/disagree";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "disagree",
    alias: ["reject", "diagreed", "nope", "nah"],
    description: "disagrees with you",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const args = {description: ctx.args.join(" ")};
    const get = await disagree(args);

    await ctx.message.channel.send(get);
}

export default {chat, middlewares: [execute]} as ChatCommand;