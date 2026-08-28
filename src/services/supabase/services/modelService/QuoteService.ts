import { supabaseModels } from "@shared/supabase";
import { Quote, QuoteCreate, QuoteUpdate } from "../../types/models/Quote";

export const tableName = "quotes";

export async function createQuote(schema: QuoteCreate): Promise<Quote>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateQuote(
    quote: Quote["quote_id"], 
    schema: QuoteUpdate, 
): Promise<Quote>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("quote_id", quote)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteQuote(
    quote: Quote["quote_id"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("quote_id", quote)
        .throwOnError();

    return true;
}