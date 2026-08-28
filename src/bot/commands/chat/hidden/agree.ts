import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { agree } from "@services/discord/agree";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "agree",
    alias: ["agrees", "agreed", "approve", "youagree?", "agree?"],
    description: "Agrees with you",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.args.length === 0)
        throw new Error("no expression to be evaluated!");

    const data = {description: ctx.args.join(" ")}
    const embed = await agree(data);

    await ctx.message.channel.send(embed);
}

export default {chat, middlewares: [execute]} as ChatCommand;