import z from "zod";

export const storyCreate = z.object({
    title: z.string().min(3),
    author: z.string().min(3).nullable().optional(),
    description: z.string().min(3).array().min(3),
    footer: z.string().min(3).nullable().optional()
});

export const storyUpdate = storyCreate.partial();

export type StoryCreate = z.input<typeof storyCreate>;
export type StoryUpdate = z.input<typeof storyUpdate>;