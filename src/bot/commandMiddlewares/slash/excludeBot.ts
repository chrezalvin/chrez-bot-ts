import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
const debug = require("debug")("middleware:slash:excludeBot");

export const excludeBot: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
    if(!ctx.interaction.user.bot){
        debug("slash command is from user, continue");
        next();
    }

    debug("slash command is from bot, skipping");
}