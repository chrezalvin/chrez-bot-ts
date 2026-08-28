import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { middlewareEngine } from "@library/middlewareEngine";
import { SlashCommand } from "@commands/types";

const debug = require("debug")("middleware:slash:CommandHandler");

export function commandHandler(slashCommands: SlashCommand[]){
    const slashCommandHandler: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
        for(const slash of slashCommands){
            if(slash.slash.name === ctx.interaction.commandName){
                debug(`slash command found: ${slash.slash.name}`);

                const handler = middlewareEngine(
                    ...slash.middlewares,
                    async (_1, _2, err) => {
                        next(err);
                    }
                )

                return handler(ctx).catch(next);
            }
        }

        next();
    }

    return slashCommandHandler;
}