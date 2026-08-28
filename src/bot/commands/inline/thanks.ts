import { CLIENT_ID } from "@config";
import { MessageType } from "discord.js";
import thanks from "@assets/messages/inline/thanks.json";
import { rngArray } from "@library/BasicFunctions";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "thanks",
    description: "reply to thanks messages",
    searchCriteria: [/(thanks?|ty)/],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
        // make sure the message is being replied to chrezbot
        if(ctx.message.type !== MessageType.Reply)
            return;

        const messageReplied = await ctx.message.fetchReference();
        if(messageReplied.author.id !== CLIENT_ID)
            return;

        // send reply
        const messageContent = ctx.message.content.toLowerCase();
        if(messageContent.includes("e.e"))
            ctx.message.reply(rngArray(thanks.sarcasm)!!);
        else
            ctx.message.reply(rngArray(thanks.genuine)!!);
};

export default {inline, middlewares: [execute]} as InlineCommand;