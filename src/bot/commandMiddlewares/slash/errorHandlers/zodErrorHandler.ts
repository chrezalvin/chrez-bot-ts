import { MyEmbedBuilder } from "@library";
import type { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { ZodError } from "zod";

const debug = require("debug")("middleware:chat:errorHandler");

export const zodErrorHandler: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next, err) => {
    if(err instanceof ZodError){
        if(!ctx.interaction.isRepliable())
            return next();

        debug(`error is from zod: ${err}`);

        const issues = err.issues;
        const error = MyEmbedBuilder.createError({
            description: issues.map(issue => `**${issue.path[issue.path.length - 1].toString()}** ${issue.message}`).join("\n")
        });

        if(ctx.interaction.deferred)
            await ctx.interaction.editReply({embeds: [error]});
        else
            await ctx.interaction.reply({embeds: [error]});
    }
    else next();
}