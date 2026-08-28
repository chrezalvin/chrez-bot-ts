import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { absoluteMute } from "@services/discord/private";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "absolutemute",
    alias: [],
    description: "mute chrezbot for all commands and inline commands until unmuted"
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const muted = ctx.args[0] === "false" ? false : true;

    const res = absoluteMute({absolutemute: muted});;
    
    await ctx.message.channel.send(res);
}

export default {
    chat, 
    middlewares: [
        chatMiddleware.requireDiscordUser({roles: ["owner"]}), 
        execute
    ]
} as ChatCommand;