import { BOT_PREFIXES } from "@config";
import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { CalculateService } from "@services/discord";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "calculate",
    alias: ["math", "m", "calc"],
    description: "Calculates a math expression",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} math 2 + 3`, 
            description: "2 + 3 = 5"
        },
        {
            command: `${BOT_PREFIXES[0]} math 2k + 2^3`, 
            description: "2k + 2^3 = 2008"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.args.length === 0)
        throw new Error("no expression to be evaluated!");
    
    const expression: string = ctx.args.join("");
    
    const embeds = CalculateService.calculate({
        expression
    });

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;