import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "pika",
    description: "sends a response to pika",
    searchCriteria: ["pika"],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    ctx.message.channel.send("chu!");
};

export default {inline, middlewares: [execute]} as InlineCommand;