import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { middlewareEngine } from "@library/middlewareEngine";
import { InlineCommand } from "@commands/types";
const debug = require("debug")("middleware:chatCommandHandler");

export function inlineCommandHandler(inlineCommands: InlineCommand[]){
    const inlineCommandHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
        for(const inline of inlineCommands){
            if(
                inline.inline.checkIfCommand(ctx.message.content) ||
                inline.inline.checkIfCommand(ctx.message)
            ){
                debug(`inline command found: ${inline.inline.name}`);

                const handler = middlewareEngine(
                    ...inline.middlewares,
                    async (_1, _2, err) => {
                        // do not pass error for inline commands
                        debug(err);
                    }
                )
                return handler(ctx).catch(next);
            }
        }

        debug("chat is not inline command");

        next();
    }

    

    return inlineCommandHandler;
}
