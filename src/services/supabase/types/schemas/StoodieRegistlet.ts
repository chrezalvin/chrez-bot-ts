import z from "zod";

export const stoodieRegistletCreate = z.object({
    stoodie: z.string().min(3),
    registlet: z.string().min(3)
});

export const stoodieRegistletUpdate = stoodieRegistletCreate.partial();

export type StoodieRegistletCreate = z.input<typeof stoodieRegistletCreate>;
export type StoodieRegistletUpdate = z.input<typeof stoodieRegistletUpdate>;