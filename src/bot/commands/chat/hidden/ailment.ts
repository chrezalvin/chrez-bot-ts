import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChatCommand } from "@commands/types";
import { BOT_PREFIXES } from "@config";
import { ailment } from "@services/discord/ailment";

const chat = new ChatCommandBuilder({
    name: "ailment",
    alias: ["debuff"],
    description: "shows ailment",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} ailment fear`,
            description: "shows ailment named \"fear\""
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.args.length === 0)
        throw new Error("no expression to be evaluated!");

    const data = {name: ctx.args.join(" ")}
    const embed = await ailment(data);

    await ctx.message.channel.send(embed);
}

export default {chat, middlewares: [execute]} as ChatCommand;