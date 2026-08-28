import { MyEmbedBuilder } from "@library";
import type { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ZodError } from "zod";

const debug = require("debug")("middleware:chat:errorHandler");

export const zodErrorHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next, err) => {
    if(err instanceof ZodError){
        debug(`error is from zod: ${err}`);

        const issues = err.issues;
        const error = MyEmbedBuilder.createError({
            description: issues.map(issue => `**${issue.path[issue.path.length - 1].toString()}** ${issue.message}`).join("\n")
        });

        await ctx.message.channel.send({embeds: [error]});
    }
    else next();
}