import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
const debug = require("debug")("middleware:requireSubCommand");


/**
 * requires the chat command to have sub command alongside the main command
 * isCommand needs to run first before using this middleware
 * @param errorHandler custom error function that returns the error when the subcommand is undefined, will be passed to next()
 * @returns 
 */
export function requireSubCommand(errorHandler?: () => any){
    const subCommandHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
        const command = ctx.args[0];
        const rest = ctx.args.slice(1)

        if(command === undefined){
            debug("subcommand is undefined, passing error to next()");
            next(errorHandler?.() ?? new Error("Subcommand is required!"));
        }
        else{
            debug(`got subcommand ${command}`);
            ctx.subCommand = {command, rest};
            next();
        }
    }

    return subCommandHandler;
}