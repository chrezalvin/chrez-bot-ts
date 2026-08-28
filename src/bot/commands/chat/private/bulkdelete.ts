import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { bulkDelete } from "@services/discord/private";
import { chatMiddleware } from "@bot/commandMiddlewares";
import { ChatCommand } from "@commands/types";
import { Message } from "discord.js";

const messageTimeout = 10;

const chat = new ChatCommandBuilder({
    name: "bulkdelete",
    description: "delete messages based on how much you put",
    examples: [
        {
            command: "Chrez bulkdelete 5",
            description: "Deletes 5 messages"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const channel = ctx.message.mentions.channels.first() ?? ctx.message.channel;
    const amount = parseInt(ctx.args[0]);

    if(isNaN(amount)) throw new Error("Argument is not a number");
    if(!channel.isTextBased()) throw new Error("Channel must be a text based channel");

    const res = await bulkDelete({
        amount, 
        channel,
        filterMessage: (msg: Message<boolean>) => {
            return msg.id !== ctx.message.id;
        },
        message: ctx.message,
        messageTimeout
    });

    const msg = await ctx.message.channel.send(res);

    setTimeout(async () => {
        if(msg.deletable)
            await msg.delete();
    }, messageTimeout * 1000);
}

export default {
    chat, 
    middlewares: [
        chatMiddleware.requireDiscordUser({roles: ["owner", "admin", "vice"]}), 
        execute,
    ]
} as ChatCommand;