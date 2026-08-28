import { unmute } from "@services/discord/private";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { ChatCommand } from "@commands/types";
import { chatMiddleware } from "@bot/commandMiddlewares";

const chat = new ChatCommandBuilder({
    name: "unmute",
    alias: ["rise", "on"],
    description: "mutes chrezbot"
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const res = unmute({})
    
    await ctx.message.channel.send(res);
}

export default {
    chat, 
    middlewares: [
        chatMiddleware.requireDiscordUser({roles: ["owner", "admin", "vice"]}), 
        execute,
    ]
} as ChatCommand;