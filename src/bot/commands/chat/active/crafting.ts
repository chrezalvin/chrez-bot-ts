import { BOT_PREFIXES } from "@config";
import { ErrorValidation } from "@library";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "crafting",
    alias: ["craft", "bs", "blacksmith"],
    description: "Recommends mobs to farm for levelling up, based on your current level",
    examples: [
        {
            command: `${BOT_PREFIXES[0]} crafting 100`, 
            description: "recommended crafts for profiency level 100"
        },
        {
            command: `${BOT_PREFIXES[0]} crafting 100 135`, 
            description: "recommended crafts for profiency level 100 and difficulty up to 135"
        },
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    // TODO
    // let profiency: number | undefined = undefined;
    // if(ctx.args && !isNaN(parseInt(ctx.args[0])))
    //     profiency = parseInt(ctx.args[0]);

    // if(!profiency)
    //     throw new ErrorValidation("something_not_found", "profiency");

    // ctx.args?.shift();

    // let difficulty: number | undefined = undefined;
    // if(ctx.args && ctx.args.length > 0 && !isNaN(parseInt(ctx.args[0])))
    //     difficulty = parseInt(ctx.args[0]);

    // const embeds = await CraftingService.crafting({
    //     profiency,
    //     difficulty
    // });

    // await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;