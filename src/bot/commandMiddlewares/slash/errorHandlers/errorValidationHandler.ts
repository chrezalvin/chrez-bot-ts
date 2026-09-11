import { ErrorValidation } from "@library";
import type { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";

const debug = require("debug")("middleware:chat:errorHandler");

export const errorValidationHandler: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next, err) => {
    
    if(ErrorValidation.isErrorValidation(err)){
        if(!ctx.interaction.isChatInputCommand())
            return next();

        debug(`error is from validation`);
        await ErrorValidation.sendErrorValidation(ctx.interaction, err);
    }
    else next();
}