import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { middlewareEngine } from "@library/middlewareEngine";
import { StringSelectCommand } from "@commands/types";

const debug = require("debug")("middleware:interact:StringSelectHandler");

export function stringSelectHandler(stringSelects: StringSelectCommand[]){
    const slashStringSelectHandler: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
        if(!ctx.interaction.isStringSelectMenu())
            return next();

        ctx.stringSelectMenuInteraction = ctx.interaction;
        debug(`handling string select menu with customId: ${ctx.interaction.customId} and values: ${ctx.interaction.values}`);

        for(const stringSelect of stringSelects){
            if(stringSelect.customId === ctx.stringSelectMenuInteraction.customId){
                debug(`stringSelect found with customId: ${stringSelect.customId}`);

                const handler = middlewareEngine(
                    ...stringSelect.middlewares,
                    async (_1, _2, err) => {
                        console.log(err);
                        next(err);
                    }
                )

                return handler(ctx).catch(next);
            }
        }

        next();
    }

    return slashStringSelectHandler;
}