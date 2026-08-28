import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { time } from "@services/discord/time";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("ChrezBot:time");

const chat = new ChatCommandBuilder({
    name: "time",
    alias: ["t", "chrono"],
    description: "Check the time in other country",
    examples: []
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    let keyword: string | undefined = undefined;
    
    if(ctx.args[0] === "me")
        keyword = ctx.message.author.id;
    if(ctx.args.length > 0)
        keyword = ctx.args.join(" ");
    
    debug(`executing Chrez time ${keyword}`);
    const embeds = await time({keyword});

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;