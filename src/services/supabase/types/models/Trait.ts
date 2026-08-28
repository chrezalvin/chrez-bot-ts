import z from "zod";

export const traitModel = z.object({
    trait: z.string(),
    name: z.string(),
    description: z.string(),
    extra: z.string().nullable(),
});

const modelShape = traitModel.shape;
export const traitCreate = traitModel.extend({
    trait: modelShape.trait.min(3),
    name: modelShape.name.min(3),
    description: modelShape.description.min(3),
    extra: modelShape.extra.optional(),
});

export const traitUpdate = traitCreate.partial();

export type Trait = z.infer<typeof traitModel>;
export type TraitCreate = z.infer<typeof traitCreate>;
export type TraitUpdate = z.infer<typeof traitUpdate>;