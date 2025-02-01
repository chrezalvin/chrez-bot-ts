import { rngInt, ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { isRecommend, Recommend } from "@models";
import { supabase } from "@shared/supabase";

export class RecommendService{
    protected static readonly recommend = "recommend";
    protected static readonly recommendImgPath = "images/recommend";
    protected static readonly recommendBucket = "images";

    public static recommendSupabase = new ServiceFileSupabase<Recommend, "recommend_id", never, "imgUrl">(
        supabase,
        "recommend_id", 
        {
            tableName: RecommendService.recommend,
            typeGuard: isRecommend,
            useCache: true,
        },
        {
            bucketName: RecommendService.recommendBucket,
            storagePath: RecommendService.recommendImgPath,
            fileKey: "imgUrl",
        }
    );

    public static async getAlldata(): Promise<Recommend[]>{
        return await RecommendService.recommendSupabase.getAll();
    }

    public static async getRandomRecommend(): Promise<Recommend>{
        const recommends = RecommendService.recommendSupabase.cache;
        const recommend = recommends[rngInt(0, recommends.length - 1)];

        return recommend;
    }

    public static async createNewRecommend(recommend: StrictOmit<Recommend, "recommend_id" | "imgUrl">, imgBlob?: Blob): Promise<Recommend>{
        // load the recommend first without the imgUrl
        const newRecommend = await RecommendService.recommendSupabase.add(recommend, {
            file: imgBlob ?? null,
            fileName: recommend.title.toLowerCase().replace(/ /g, "_"),
        });

        return newRecommend;
    }

    public static async getRandomRecommendByTag(tag: string): Promise<Recommend>{
        const recommends = await RecommendService
            .recommendSupabase
            .queryBuilder((query) => query
                .overlaps("category", [tag])
            );

        if(!Array.isArray(recommends))
            throw new Error("No recommend found");

        if(recommends.length === 0)
            throw new Error(`No recommend found with tag ${tag}`);

        return recommends[rngInt(0, recommends.length - 1)];
    }

    static async updateRecommend(id: Recommend["recommend_id"], editedRecommend: Partial<StrictOmit<Recommend, "recommend_id" | "imgUrl">>, imgBlob?: Blob): Promise<Recommend>{
        const recommend = await RecommendService.recommendSupabase.get(id);
        const fileName = (editedRecommend.title ?? recommend.title).toLowerCase().replace(/ /g, "_");

        if(imgBlob)
            return await RecommendService.recommendSupabase.update(id, editedRecommend, {file: imgBlob, fileName});
        else
            return await RecommendService.recommendSupabase.update(id, editedRecommend);
    }

    static async deleteRecommend(id: Recommend["recommend_id"]): Promise<void>{
        await RecommendService.recommendSupabase.delete(id);
    }
}