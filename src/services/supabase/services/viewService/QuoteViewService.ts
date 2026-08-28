import { quoteView, QuoteView } from "@services/supabase/types/views/QuoteView";
import { supabasePublic } from "@shared/supabase";

export async function getRandomQuote(): Promise<QuoteView>{
    const {data} = await supabasePublic
        .from("vw_quote_random")
        .select()
        .single();

    const parsed = quoteView.parse(data);
    
    return parsed;
}

export async function getQuote(quote_id: number): Promise<QuoteView | null>{
    const {data} = await supabasePublic
        .from("vw_quotes")
        .select()
        .eq("quote_id", quote_id)
        .single();

    const parsed = quoteView.nullable().parse(data);
    
    return parsed;
}