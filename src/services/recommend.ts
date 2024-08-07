const debug = require('debug')('Server:recommend');

import { rngInt } from "@library";
import {ServiceSupabase, FileManagerSupabase} from "@library";
import { isRecommend, Recommend } from "@models";

export class RecommendService{
    protected static readonly recommendedPath = "recommend";
    protected static readonly bucket = "images";
    protected static readonly recommend = "recommend";

    public static service = new ServiceSupabase<Recommend, "id">( 
        "id", 
        RecommendService.recommend, 
        {typeGuard: isRecommend,}
    );

    protected static changeImgUrlToUrl(recommend: Recommend): Recommend{
        return recommend.imgUrl ? {...recommend, imgUrl: RecommendService.fileManager.translateToUrl(recommend.imgUrl)} : {...recommend, id: recommend.id};
    }

    public static fileManager = new FileManagerSupabase(RecommendService.bucket, RecommendService.recommendedPath);

    public static async getAlldata(): Promise<Recommend[]>{
        const res = await RecommendService.service.getAll();
        return res.map((val) => RecommendService.changeImgUrlToUrl(val));
    }

    public static getRandomRecommend(): Recommend{
        const recommends = RecommendService.service.cache;
        const recommend = recommends[rngInt(0, recommends.length - 1)];
        return RecommendService.changeImgUrlToUrl(recommend);
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
            const res = await RecommendService.fileManager.uploadImage(imgUrl);
            const data = await RecommendService.service.update(newRecommend.id, {...recommend, imgUrl: res});

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
            await RecommendService.fileManager.deleteImage(rec.imgUrl);
    }
}