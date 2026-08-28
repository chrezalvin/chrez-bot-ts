import z from "zod";

export const storyModel = z.object({
    story_id: z.number(),
    title: z.string(),
    author: z.string().nullable(),
    description: z.array(z.string()),
    footer: z.string().nullable()
});

const modelShape = storyModel.shape;
export const storyCreate = storyModel
.extend({
    title: modelShape.title.min(3),
    author: modelShape.author.optional(),
    description: modelShape.description.min(1),
    footer: modelShape.footer
});

export const storyUpdate = storyCreate.partial();

export type Story = z.infer<typeof storyModel>;
export type StoryCreate = z.infer<typeof storyCreate>;
export type StoryUpdate = z.infer<typeof storyUpdate>;