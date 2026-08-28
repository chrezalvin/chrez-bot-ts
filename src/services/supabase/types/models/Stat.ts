import z from "zod";

export const statModel = z.object({
    stat: z.string(),
    stat_name: z.string(),
    aliases: z.array(z.string()),
});

const modelShape = statModel.shape;
export const statCreate = statModel
.extend({
    stat: modelShape.stat.min(3),
    stat_name: modelShape.stat.min(3),
    aliases: modelShape.aliases.optional(),
});

export const statUpdate = statCreate.partial();

export type Stat = z.infer<typeof statModel>;
export type StatCreate = z.infer<typeof statCreate>;
export type StatUpdate = z.infer<typeof statUpdate>;