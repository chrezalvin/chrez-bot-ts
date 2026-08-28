import type { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";

const debug = require("debug")("middleware:chat:errorHandler");

export const errorHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next, err) => {
    debug(JSON.stringify(err, null, 2));
    
    if(typeof err === "string")
        ctx.message.channel.send(`Error: ${err}`);
    else
        ctx.message.channel.send("An unknown error occurred.");
}