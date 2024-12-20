import { rngInt, ServiceFileSupabase } from "@library";
import { isRecommend, Recommend } from "@models";

export class RecommendService{
    protected static readonly recommend = "recommend";
    protected static readonly recommendImgPath = "images/recommend";
    protected static readonly recommendBucket = "images";

    public static recommendSupabase = new ServiceFileSupabase<Recommend, "id", never, "imgUrl">("id", 
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

    public static async createNewRecommend(recommend: Omit<Recommend, "id">, imgBlob?: Blob): Promise<Recommend>{
        // load the recommend first without the imgUrl
        const newRecommend = await RecommendService.recommendSupabase.add(recommend, {
            file: imgBlob ?? null,
            fileName: recommend.title.toLowerCase().replace(/ /g, "_"),
        });

        return newRecommend;
    }

    static async updateRecommend(id: Recommend["id"], editedRecommend: Partial<Omit<Recommend, "id" | "imgUrl">>, imgBlob?: Blob): Promise<Recommend>{
        const recommend = await RecommendService.recommendSupabase.get(id);
        const fileName = (editedRecommend.title ?? recommend.title).toLowerCase().replace(/ /g, "_");

        if(imgBlob)
            return await RecommendService.recommendSupabase.update(id, editedRecommend, {file: imgBlob, fileName});
        else
            return await RecommendService.recommendSupabase.update(id, editedRecommend);
    }

    static async deleteRecommend(id: Recommend["id"]): Promise<void>{
        await RecommendService.recommendSupabase.delete(id);
    }
}