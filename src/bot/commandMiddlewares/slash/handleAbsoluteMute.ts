import { ErrorValidation } from "@library";
import { absoluteMuted } from "@shared/isAbsoluteMuted";
import { BOT_OWNER_ID } from "@config";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
const debug = require("debug")("middleware:slash:handleAbsoluteMute");

export const handleAbsoluteMute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
    if(absoluteMuted){
        debug("bot is absolutely muted");

        if(ctx.interaction.user.id === BOT_OWNER_ID)
            next();
        else
            next(new ErrorValidation("slash_command_unavailable", `because the bot is absolutely muted!.`));
    }
    else
        next();
}