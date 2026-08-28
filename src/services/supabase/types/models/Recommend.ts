import z from "zod";

export const recommendModel = z.object({
    recommend_id: z.number(),
    title: z.string(),
    description: z.string(),
    imgUrl: z.url().nullable(),
    link: z.url().nullable()
});

const modelShape = recommendModel.shape;
export const recommendCreate = recommendModel
.extend({
    title: modelShape.title.min(3),
    description: modelShape.title.min(3),
    imgUrl: modelShape.imgUrl.optional(),
    link: modelShape.link.optional()
});

export const recommendUpdate = recommendCreate.partial();

export type Recommend = z.infer<typeof recommendModel>;
export type RecommendCreate = z.infer<typeof recommendCreate>;
export type RecommendUpdate = z.infer<typeof recommendUpdate>;