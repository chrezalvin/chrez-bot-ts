import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { MessageType } from "discord.js";
import { ErrorValidation } from "@library";
import { translate } from "@services/discord/translate";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "translate",
    alias: ["explain", "define", "meaning", "slang"],
    description: "Gives you translation of slangs",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let content: string = "";

    // if the message is referencing another message (is replying to someone) get the message being replied to
    if(ctx.message.type === MessageType.Reply){
        const repliedMessage = await ctx.message.fetchReference();

        content = repliedMessage.content;
    }
    // if it doesn't replying anyone, get the last message before the user's message
    else{
        const messages = await ctx.message.channel.messages.fetch({limit: 2});
        const messageBefore = messages.last();

        if(!messageBefore)
            throw new ErrorValidation("message_error");

        content = messageBefore.content;
    }

    const res = await translate({
        message: content
    });

    ctx.message.channel.send(res);
}

export default {chat, middlewares: [execute]} as ChatCommand;