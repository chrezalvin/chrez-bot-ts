import { ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { isQuote, Quote } from "@models";
import { supabase } from "@shared/supabase";

export class QuoteService{
    protected static readonly quotePath = "quotes";
    protected static readonly randomQuoteView = "quotes_random";

    static quoteSupabase = new ServiceFileSupabase<Quote, "quote_id">(
        supabase,
        "quote_id", {
        tableName: QuoteService.quotePath,
        typeGuard: isQuote,
        useCache: true,
    });

    static getQuoteList(){
        return QuoteService.quoteSupabase.cache;
    }

    /**
     * get one random quote, it's sfw by default but can get nsfw quote if set to true
     * @param nsfw 
     * @returns 
     */
    static async getRandomQuote(nsfw: boolean = false): Promise<Quote>{        
        const quote = await QuoteService.quoteSupabase.call("get_random_quote", nsfw);

        if(quote.length < 0)
            throw new Error("Something went wrong");
        
        return quote[0];
    }

    static async getQuoteById(quoteId: Quote["quote_id"]): Promise<Quote | undefined>{
        return await QuoteService.quoteSupabase.get(quoteId);
    }

    static async setNewQuote(quote: StrictOmit<Quote, "quote_id">){
        return QuoteService.quoteSupabase.add(quote);
    }

    static async updateQuote(quoteId: Quote["quote_id"], quote: Partial<StrictOmit<Quote, "quote_id">>){
        return await QuoteService.quoteSupabase.update(quoteId, quote);
    }

    static async deleteQuote(quoteId: Quote["quote_id"]){
        return await QuoteService.quoteSupabase.delete(quoteId);
    }
}

export default QuoteService;