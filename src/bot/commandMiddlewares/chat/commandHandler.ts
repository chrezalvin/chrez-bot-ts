import { ErrorValidation } from "@library";
import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { middlewareEngine } from "@library/middlewareEngine";
import { ChatCommand } from "@commands/types";
const debug = require("debug")("middleware:chat:commandHandler");

export function commandHandler(chatCommands: ChatCommand[]){
    const commandHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
        for(const chat of chatCommands){
            if(chat.chat.checkIfCommand(ctx.command)){
                debug(`chat command found: ${chat.chat.name}`);
    
                const handler = middlewareEngine(
                    ...chat.middlewares, 
                    async (_1, _2, err) => {
                        next(err);
                    }
                )
    
                return handler(ctx);
            }
        }
    
        next(new ErrorValidation("something_not_found", "command"));
    }

    return commandHandler;
}
