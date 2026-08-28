import z from "zod";

export const quoteModel = z.object({
    quote_id: z.number(),
    author: z.string().nullable(),
    description: z.array(z.string()),
    memberRef: z.string().nullable(),
    nsfw: z.boolean()
});

const modelShape = quoteModel.shape;
export const quoteCreate = quoteModel
.omit({
    quote_id: true
})
.extend({
    author: modelShape.author.optional(),
    description: modelShape.description,
    memberRef: modelShape.memberRef.nullable(),
    nsfw: modelShape.nsfw.optional()
});

export const quoteUpdate = quoteCreate.partial();

export type Quote = z.infer<typeof quoteModel>;
export type QuoteCreate = z.infer<typeof quoteCreate>;
export type QuoteUpdate = z.infer<typeof quoteUpdate>;