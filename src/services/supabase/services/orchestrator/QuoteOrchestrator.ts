import { QuoteView } from "@services/supabase/types/views/QuoteView";
import { QuoteViewService } from "../viewService";
import { QuoteCreate, QuoteUpdate } from "@services/supabase/types/models/Quote";
import { QuoteService } from "../modelService";
import { MappedArray } from "@library/MappedArray";

const cache = new MappedArray<QuoteView["quote_id"], QuoteView>();

export async function getRandomQuote(): Promise<QuoteView>{
    return await QuoteViewService.getRandomQuote();
}

export async function getQuote(quote_id: QuoteView["quote_id"]): Promise<QuoteView | null>{
    return await QuoteViewService.getQuote(quote_id);
}

export async function createQuote(quoteCreate: QuoteCreate): Promise<QuoteView>{
    const createdQuote = await QuoteService.createQuote(quoteCreate);

    const quote = await QuoteViewService.getQuote(createdQuote.quote_id);

    if(!quote)
        throw new Error("Quote not found!");

    return quote;
}

export async function updateQuote(quote_id: QuoteView["quote_id"], quoteUpdate: QuoteUpdate): Promise<QuoteView>{
    const existingQuote = await QuoteViewService.getQuote(quote_id);

    if(!existingQuote)
        throw new Error("no existing quote found!");

    await QuoteService.updateQuote(quote_id, quoteUpdate);

    const quote = await QuoteViewService.getQuote(quote_id);

    if(!quote)
        throw new Error("Quote not found!");

    return quote;
}

export async function deleteQuote(quote_id: QuoteView["quote_id"]): Promise<true>{
    return await QuoteService.deleteQuote(quote_id);
}