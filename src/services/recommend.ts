const debug = require('debug')('Server:recommend');

import { rngInt } from "@library";
import {ServiceSupabase, FileManagerSupabase} from "@library";
import { FileManagerFirebase } from "@library/FileManagerFirebase";
import { isRecommend, Recommend } from "@models";

export class RecommendService{
    protected static readonly recommendedPath = "recommend";
    protected static readonly bucket = "images";
    protected static readonly recommend = "recommend";

    protected static readonly firebaseImgPath = "images/recommend";

    public static service = new ServiceSupabase<Recommend, "id">( 
        "id", 
        RecommendService.recommend, 
        {typeGuard: isRecommend,}
    );

    protected static async changeImgUrlToUrl(recommend: Recommend): Promise<Recommend>{
        return recommend.imgUrl ? {...recommend, imgUrl: await RecommendService.fileManager2.translateToUrl(recommend.imgUrl)} : {...recommend, id: recommend.id};
    }

    // public static fileManager = new FileManagerSupabase(RecommendService.bucket, RecommendService.recommendedPath);
    public static fileManager2 = new FileManagerFirebase(RecommendService.firebaseImgPath);

    public static async getAlldata(): Promise<Recommend[]>{
        const res = await RecommendService.service.getAll();
        return Promise.all(res.map(async (val) => await RecommendService.changeImgUrlToUrl(val)));
    }

    public static async getRandomRecommend(): Promise<Recommend>{
        const recommends = RecommendService.service.cache;
        const recommend = recommends[rngInt(0, recommends.length - 1)];
        return await RecommendService.changeImgUrlToUrl(recommend);
    }

    public static async createNewrecommend(recommend: Omit<Recommend, "id">, imgUrl?: string): Promise<Recommend>{
        // load the recommended first without the imgUrl
        const rec: Omit<Recommend, "id"> = {
            title: recommend.title,
            description: recommend.description,
        };

        if(recommend.link)
            rec.link = recommend.link;
        if(recommend.category)
            rec.category = recommend.category;

        const newRecommend = await RecommendService.service.add(rec);

        if(!newRecommend)
            throw new Error("Failed to create new recommend");

        // then upload the image
        if(imgUrl){
            const res = await RecommendService.fileManager2.uploadImage(imgUrl);
            const data = await RecommendService.service.update(newRecommend.id, {...recommend, imgUrl: res?.metadata.name});

            if(data)
                newRecommend.imgUrl = data.imgUrl;
        }

        return RecommendService.changeImgUrlToUrl(newRecommend);
    }

    public static async deleteRecommend(id: number){
        const rec = await RecommendService.service.get(id);

        if(!rec)
            throw new Error("Recommend not found");

        await RecommendService.service.delete(rec.id);

        if(rec.imgUrl)
            await RecommendService.fileManager2.deleteImage(rec.imgUrl);
    }
}