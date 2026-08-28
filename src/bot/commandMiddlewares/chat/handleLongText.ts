import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";

const debug = require("debug")("middleware:handleLongText");

export function handleLongText(treshold: number){
    if(treshold < 0)
        throw new Error("treshold cannot be lower than 0");

    const handleLongText: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
        // simply ignore ctx.messages that are too long
        if (ctx.message.content.length < treshold){
            debug(`text is processed, length: ${ctx.message.content.length}`);
            next();
        }
        else
            debug(`text too long to process, length: ${ctx.message.content.length}`);
    }

    return handleLongText;
}