import { ChrezBotChatMiddleware } from "@library";
import { CustomArgs } from "@typings";

export const excludeBotChat: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    if(!message.author.bot)
        next();
}