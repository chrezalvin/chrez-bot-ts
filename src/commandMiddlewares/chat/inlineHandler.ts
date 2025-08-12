import { ChrezBotChatMiddleware } from "@library";
import { CustomArgs } from "@typings";
import { inlineCommands } from "@shared/commands";
import { muted } from "@shared/isMute";

export const inlineHandler: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    if(!muted)
        for(const command of inlineCommands)
            for(const criteria of command[1].searchCriteria){
                if(typeof criteria === "string" && message.content === criteria)
                    return command[1].execute(message);
                else if(typeof criteria === "function" && criteria(message))
                    return command[1].execute(message);
                else if(typeof criteria === "object" && criteria.test(message.content))
                    return command[1].execute(message);
            }

    next();
}