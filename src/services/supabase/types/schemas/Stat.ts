import z from "zod";

export const statCreate = z.object({
    stat: z.string().min(3),
    stat_name: z.string().min(3),
    aliases: z.string().min(3).array().optional(),
});

export const statUpdate = statCreate.partial();

export type StatCreate = z.input<typeof statCreate>;
export type StatUpdate = z.input<typeof statUpdate>;