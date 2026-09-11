import z from "zod";

export const quoteCreate = z.object({
    author: z.string().min(3).nullable().optional(),
    description: z.string().min(3).array().min(3),
    memberRef: z.string().min(3).nullable().optional(),
    nsfw: z.boolean().optional()
});

export const quoteUpdate = quoteCreate.partial();

export type QuoteCreate = z.input<typeof quoteCreate>;
export type QuoteUpdate = z.input<typeof quoteUpdate>;