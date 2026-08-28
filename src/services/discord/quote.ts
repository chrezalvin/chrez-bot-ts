import { ErrorValidation, getProfileByID, MyEmbedBuilder } from "@library";
import { QuoteOrchestrator } from "@services/supabase/services/orchestrator";
import { QuoteView } from "@services/supabase/types/views/QuoteView";
import {InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const quoteSchema = z.object({
    index: z.number().min(0).optional()
});

export type I_Quote = z.infer<typeof quoteSchema>;

export async function quote(args: I_Quote): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = quoteSchema.parse(args);

    const embed = new MyEmbedBuilder();

    let quote: QuoteView | null = null;
    if(parsed.index)
        quote = await QuoteOrchestrator.getQuote(parsed.index)
    else
        quote = await QuoteOrchestrator.getRandomQuote()

    if(!quote)
        throw new ErrorValidation("something_not_found", "quote");

    embed.setDescription(quote.nsfw ?  `||${quote.description.join("\n")}||` : quote.description.join("\n"))

    if(quote.memberRef){
        const member = getProfileByID(quote.memberRef);
        embed.setAuthor({name: quote.author ?? "no author", iconURL: `https://cdn.discordapp.com/avatars/${quote.memberRef}/${member?.avatarID}.webp`})
    }

    embed.setFooter({text: `quote #${quote.quote_id}`});

    return {embeds: [embed], content: quote.nsfw ? "this quote is spoilered because it's NSFW" : undefined};
}