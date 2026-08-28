import { MyEmbedBuilder } from "@library";
import type { ChatContext, ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import z from "zod";

const debug = require("debug")("middleware:chat:errorHandler");

const postgresError = z.object({
    name: z.string(),
    details: z.string(),
    hint: z.string().nullable(),
    code: z.string(),
});

export const postgresErrorHandler: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next, err) => {
    const parsed = postgresError.safeParse(err);

    if(parsed.success){
        debug(`postgres error: ${err}`);

        const error = MyEmbedBuilder.createError({
            description: `failed to retrieve data from database!\nreason: ${parsed.data.details}`
        });
    
        if(ctx.interaction.deferred)
            await ctx.interaction.editReply({embeds: [error]});
        else
            await ctx.interaction.reply({embeds: [error]});        
    }
    else next();
}