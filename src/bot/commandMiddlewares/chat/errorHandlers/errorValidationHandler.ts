import { ErrorValidation } from "@library";
import type { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";

const debug = require("debug")("middleware:chat:errorHandler");

export const errorValidationHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next, err) => {
    
    if(ErrorValidation.isErrorValidation(err)){
        debug(`error is from validation`);
        await ErrorValidation.sendErrorValidation(ctx.message, err);
    }
    else next();
}