import { isQuoteWithoutId } from '@models';
import QuoteService from '@services/quote';
import { Request, Response } from 'express';

export const quote_get_all = async (req: Request, res: Response) => {
    const quotes = await QuoteService.getQuoteList();

    res.json(quotes);
}

export const quote_post_edit = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const quote = req.body.quote as unknown;

    if(isNaN(id) || !isQuoteWithoutId(quote))
        throw new Error("invalid quote object");

    const editedQuote = await QuoteService.updateQuote(id, quote);

    if(!editedQuote)
        throw new Error("quote not found");

    res.status(200).json(editedQuote);
}

export const quote_post_add = async (req: Request, res: Response) => {
    const quote = req.body.quote as unknown;

    if(!isQuoteWithoutId(quote))
        throw new Error("invalid quote object");

    const newQuote = await QuoteService.setNewQuote(quote);

    if(!newQuote)
        throw new Error("Failed to add quote");

    res.status(200).json(newQuote);
}

export const quote_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);

    if(isNaN(id))
        throw new Error("Invalid id!");

    await QuoteService.deleteQuote(id);

    res.status(200).json({success: true});
}

export const quote_get_by_id = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if(isNaN(id))
        throw new Error("Invalid id!");

    const quote = await QuoteService.getQuoteById(id);
}