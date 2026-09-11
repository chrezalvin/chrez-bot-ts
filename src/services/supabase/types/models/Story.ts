import z from "zod";

export const storyModel = z.object({
    story_id: z.number(),
    title: z.string(),
    author: z.string().nullable(),
    description: z.array(z.string()),
    footer: z.string().nullable()
});

export type Story = z.infer<typeof storyModel>;