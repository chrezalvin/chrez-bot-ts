import {rngInt} from "@library";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";
import { MessageType } from "discord.js";

const nos = [
    ":(",
    "oh ok",
    "okay :(",
    "D:",
    "oh well",
    "oh",
    "I see",
    "I understand",
]

const inline = new InlineCommandBuilder({
    name: "no",
    searchCriteria: [/^no$/i, /^i refuse$/i],
    description: "responds to user saying no to reply",
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const no = nos[rngInt(0, nos.length - 1)];

    if(ctx.message.type === MessageType.Reply){
        const repliedMessage = await ctx.message.fetchReference();
        if(repliedMessage.author.id === ctx.message.client.user?.id)
            await ctx.message.reply(no);
    }
};

export default {inline, middlewares: [execute]} as InlineCommand;