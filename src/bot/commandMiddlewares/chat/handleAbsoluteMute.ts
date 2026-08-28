import { absoluteMuted } from "@shared/isAbsoluteMuted";
import { BOT_OWNER_ID } from "@config";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
const debug = require("debug")("midddlewar:handleAbsoluteMute");

export const handleAbsoluteMute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
    if(absoluteMuted){
        debug("bot is absolute muted!");
        if(ctx.message.author.id === BOT_OWNER_ID)
            next();
    }
    else
        next();
}