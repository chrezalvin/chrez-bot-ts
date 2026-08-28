import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
const debug = require("debug")("middleware:excludeBot");

export const excludeBot: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
    if(!ctx.message.author.bot){
        debug("chat is from user, continue");
        return next();
    }

    debug("chat is from bot, skipping...");
}