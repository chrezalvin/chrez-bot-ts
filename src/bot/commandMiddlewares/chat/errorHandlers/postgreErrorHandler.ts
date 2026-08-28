import { MyEmbedBuilder } from "@library";
import type { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import z from "zod";

const debug = require("debug")("middleware:chat:errorHandler");

const postgresError = z.object({
    name: z.string(),
    details: z.string(),
    hint: z.string().nullable(),
    code: z.string(),
});

export const postgresErrorHandler: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next, err) => {
    const parsed = postgresError.safeParse(err);

    if(parsed.success){
        debug(`postgres error: ${err}`);

        const error = MyEmbedBuilder.createError({
            description: `failed to retrieve data from database!\nreason: ${parsed.data.details}`
        });
    
        await ctx.message.channel.send({embeds: [error]});        
    }
    else next();
}