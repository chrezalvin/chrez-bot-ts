import { ChrezBotChatMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { absoluteMuted } from "@shared/isAbsoluteMuted";
import { BOT_OWNER_ID } from "@config";

export const handleAbsoluteMute: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    if(absoluteMuted){
        if(message.author.id === BOT_OWNER_ID)
            next();
    }
    else
        next();
}