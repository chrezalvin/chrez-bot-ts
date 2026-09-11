import z from "zod";

export const quoteModel = z.object({
    quote_id: z.number(),
    author: z.string().nullable(),
    description: z.array(z.string()),
    memberRef: z.string().nullable(),
    nsfw: z.boolean()
});

export type Quote = z.infer<typeof quoteModel>;