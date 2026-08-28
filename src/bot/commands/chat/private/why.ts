import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { why } from "@services/discord/private";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "why",
    alias: ["y"],
    description: "Answering the real question"
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = await why({
        discordId: ctx.message.author.id
    });
        
    await ctx.message.channel.send(res);

    await ctx.message.channel.send(res);
}

export default {
    chat, 
    middlewares: [
        chatMiddleware.requireDiscordUser({roles: ["owner"]}), 
        execute,
    ]
} as ChatCommand;