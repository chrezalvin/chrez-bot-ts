import type { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";

const debug = require("debug")("middleware:chat:errorHandler");

export const errorHandler: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next, err) => {
    debug(JSON.stringify(err, null, 2));

    if(!ctx.interaction.isRepliable())
        return;
    
    if(typeof err === "string")
        if(ctx.interaction.deferred)
            ctx.interaction.editReply(`Error: ${err}`);
        else
            ctx.interaction.reply(`Error: ${err}`);
    else
        if(ctx.interaction.deferred)
            ctx.interaction.editReply("An unknown error occurred.");
        else
            ctx.interaction.reply("An unknown error occurred.");
}