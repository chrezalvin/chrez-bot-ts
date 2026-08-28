import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
const debug = require("debug")("middleware:requireCommand");

export function requireCommand(botPrefixes: string[]){
    const requireCommand: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {
        const args = ctx.message.content.split(/ +/);
    
        // minimum of 2 arguments
        if(args.length < 1){
            debug("argument is shorter than 2, skipping...");
            return;
        }
    
        for (const prefix of botPrefixes)
            if (args[0] === prefix){
                
                ctx.prefix = args.shift()!;
                ctx.command = args.shift()!;
                ctx.args = args.map(e => e.toLowerCase());
    
                debug(`received chat command ${ctx.prefix} ${ctx.command} args: ${ctx.args.join(", ")}`);
                
                return next();
            }
    }

    return requireCommand;
}