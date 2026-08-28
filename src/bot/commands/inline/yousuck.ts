import {rngInt} from "@library";
import { MessageType } from "discord.js";
import yousuckData from "@assets/messages/inline/yousuck.json";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "yousuck",
    searchCriteria: [/^you suck$/i],
    description: "sending message when chrezbot is being replied by a message that contains 'you suck'",
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.message.type === MessageType.Reply){
        const repliedMessage = await ctx.message.fetchReference();

        const yousuck = yousuckData[rngInt(0, yousuckData.length - 1)];
        if(repliedMessage.author.id === ctx.message.client.user?.id)
            await ctx.message.reply(yousuck);
    }
};

export default {inline, middlewares: [execute]} as InlineCommand;