const debug = require('debug')('Server:recommend');

import { Service } from "@library/Service";
import { FileManager } from "@library/FileManager";

export interface Recommend{
    title: string;
    description: string;
    imgUrl?: string;
    link?: string;
    category?: string[];
}

export function isRecommend(obj: unknown): obj is Recommend{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("title" in obj) || !("description" in obj)) return false;

    return obj.title !== undefined && obj.description !== undefined;
}

export class RecommendService{
    protected static recommendedPath = "images/recommend";
    protected static recommend = "recommend";

    public static service: Service<Recommend> = new Service<Recommend>({
        dbName: RecommendService.recommend,
        typeGuard: isRecommend
    });

    public static fileManger: FileManager = new FileManager(RecommendService.recommendedPath);

    public static async createNewrecommend(recommend: Recommend, imgUrl?: string): Promise<string>{
        // load the recommended first without the imgUrl
        const rec: Recommend = {
            title: recommend.title,
            description: recommend.description,
        };

        if(recommend.link)
            rec.link = recommend.link;
        if(recommend.category)
            rec.category = recommend.category;

        const id = await RecommendService.service.addData(rec);

        // then upload the image
        if(imgUrl){
            const res = await RecommendService.fileManger.uploadImage(imgUrl, id);
            if(res)
                await RecommendService.service.updateData(id, {...recommend, imgUrl: res.ref.fullPath});
        }

        return id;
    }
}

// load the data then cache it at the start of the server
RecommendService.service.getAllData();