import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "sad",
    description: "Unsad people",
    searchCriteria: [/^don'?t be sad/i],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    await ctx.message.channel.send("sad backwards is das and");
    await ctx.message.channel.send("das not good");
};

export default {inline, middlewares: [execute]} as InlineCommand;