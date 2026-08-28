import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { roshambo } from "@services/discord/roshambo";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "roshambo",
    alias: ["rps"],
    description: "plays rock paper scissor",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.args.length === 0)
        throw new Error("pick rock paper or scissor to play the game");

    const choice: string = ctx.args[0];

    const embeds = await roshambo({choice});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;