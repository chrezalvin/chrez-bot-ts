import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { foodBuffCode } from "@services/discord/FoodBuff/foodBuffCode";
import { myFoodBuffCode, setFoodBuffCode } from "@services/discord/FoodBuff";
import { ChatCommand } from "@commands/types";
import { chatMiddleware } from "@bot/commandMiddlewares";

const chat = new ChatCommandBuilder({
    name: "foodbuffcode",
    alias: ["code", "buffcode", "foodcode", "food"],
    description: "Search food buffs code by name",
    examples: [
        {
            command: "Chrez food str",
            description: "Searches for str food buff codes"
        },
        {
            command: "Chrez food me",
            description: "Searches for your preferred food buff codes"
        },
        {
            command: "Chrez food set atk, mp, crit",
            description: "Sets your preferred food buffs to `atk`, `mp`, and `crit`"
        }
    ]
});

const executeSetCommand: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
    if(ctx.subCommand?.command !== "set")
        return next()

    const setArgs = ctx.subCommand.rest.join("").split(",").map(stat => stat.trim());

    const embeds = await setFoodBuffCode({
        user_id: ctx.message.author.id,
        keywords: setArgs
    });

    await ctx.message.channel.send(embeds);
}

const executeMeCommand: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
    if(ctx.subCommand?.command !== "me") 
        return next();

    const embed = await myFoodBuffCode({
        user_id: ctx.message.author.id
    });

    await ctx.message.channel.send(embed);
}

const executeStatCommand: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const embeds = await foodBuffCode({stat: ctx.args.join("")});    

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [
    chatMiddleware.requireSubCommand(() => new Error("Please provide a name")), 
    executeSetCommand,
    executeMeCommand,
    executeStatCommand
]} as ChatCommand;