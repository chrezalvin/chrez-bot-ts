import z from "zod";

export const emojiModel = z.object({
    emoji: z.string(),
    emoji_id: z.string(),
    aliases: z.array(z.string()).nullable(),
    image: z.string(),
});

const modelShape = emojiModel.shape;
export const emojiCreate = z.object({
    emoji: emojiModel.omit({
        image: true,
    }).extend({
        emoji: modelShape.emoji.min(3),
        emoji_id: modelShape.emoji_id.min(3),
        // alias: modelShape.alias.max(5).nullable().optional()
    }),
    image: z.custom<Blob>(),
});

export const emojiUpdate = emojiCreate.extend({
    emoji: emojiCreate.shape.emoji.partial(),
    image: emojiCreate.shape.image.optional()
});

export type Emoji = z.infer<typeof emojiModel>;
export type EmojiCreate = z.infer<typeof emojiCreate>;
export type EmojiUpdate = z.infer<typeof emojiUpdate>;