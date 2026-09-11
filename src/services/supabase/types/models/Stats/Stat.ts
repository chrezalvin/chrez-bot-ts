import z from "zod";

export const statModel = z.object({
    stat: z.string(),
    stat_name: z.string(),
    stat_markdown: z.string(),
    icon: z.string(),
    order: z.number(),
});

export type Stat = z.infer<typeof statModel>;