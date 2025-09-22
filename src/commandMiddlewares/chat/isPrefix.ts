import { ChrezBotChatMiddleware } from "@library";
import { CustomArgs } from "@typings";
import { BOT_PREFIXES } from "@config";

export const isPrefix: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    for (const prefix of BOT_PREFIXES)
        if (message.content.startsWith(prefix + " "))
            return next();
}