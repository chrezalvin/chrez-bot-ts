const debug = require('debug')('Server:recommend');

import { rngInt } from "@library";
import {ServiceSupabase} from "@library";
import { FileManagerFirebase } from "@library/FileManagerFirebase";
import { isRecommend, Recommend } from "@models";

export class RecommendService{
    protected static readonly recommend = "recommend";

    protected static readonly firebaseImgPath = "images/recommend";

    public static service = new ServiceSupabase<Recommend, "id">( 
        "id", 
        RecommendService.recommend, 
        {typeGuard: isRecommend,}
    );

    protected static async changeImgUrlToUrl(recommend: Recommend): Promise<Recommend>{
        return recommend.imgUrl ? {...recommend, imgUrl: await RecommendService.fileManager2.getUrlFromPath(recommend.imgUrl)} : {...recommend, id: recommend.id};
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

    public static async createNewRecommend(recommend: Omit<Recommend, "id">, imgBlob?: Blob): Promise<Recommend>{
        // load the recommend first without the imgUrl
        const newRecommend = await RecommendService.service.add({...recommend, imgUrl: null});

        if(!newRecommend)
            throw new Error("Failed to create new Recommend");

        if(!imgBlob)
            return await RecommendService.changeImgUrlToUrl(newRecommend);
        
        const fileName: string = recommend.title.toLowerCase().replace(/ /g, "_");
        const res = await RecommendService.fileManager2.uploadImage(imgBlob, fileName);

        if(!res)
            throw new Error("Failed to upload image");

        const data = await RecommendService.service.update(newRecommend.id, {imgUrl: res.metadata.fullPath});

        if(!data)
            throw new Error("Failed to update Recommend");

        return await RecommendService.changeImgUrlToUrl(data);
    }

    static async updateRecommend(id: Recommend["id"], editedRecommend: Partial<Omit<Recommend, "id" | "imgUrl">>, imgBlob?: Blob): Promise<Recommend>{
        const recommend = await RecommendService.service.get(id);

        if(!recommend)
            throw new Error("Recommend not found!");

        const updatedRecommend = await RecommendService.service.update(id, editedRecommend);

        if(!updatedRecommend)
            throw new Error("Failed to update Recommend!");

        if(!imgBlob)
            return RecommendService.changeImgUrlToUrl(updatedRecommend);

        if(recommend.imgUrl){
            const fileName = recommend.imgUrl.split("/").pop();
            
            if(!fileName)
                throw new Error("Failed to get image name!");
            
            await RecommendService.fileManager2.deleteImage(fileName);
        }

        let fileName: string;
        if(editedRecommend.title)
            fileName = editedRecommend.title.toLowerCase().replace(/ /g, "_");
        else
            fileName = recommend.title.toLowerCase().replace(/ /g, "_");

        const fileNameRes =  await RecommendService.fileManager2.uploadImage(imgBlob, fileName);

        if(!fileNameRes)
            throw new Error("Failed to upload image!");

        const updatedImageRecommend = await RecommendService.service.update(id, {imgUrl: fileNameRes.metadata.fullPath});

        if(!updatedImageRecommend)
            throw new Error("Failed to update Recommend!");

        return await RecommendService.changeImgUrlToUrl(updatedImageRecommend);
    }

    static async deleteRecommend(id: Recommend["id"]): Promise<void>{
        const recommend = await RecommendService.service.get(id);

        if(!recommend)
            throw new Error("Recommend not found!");

        if(recommend.imgUrl){
            const fileName = recommend.imgUrl.split("/").pop();

            if(!fileName)
                throw new Error("Failed to get image name!");

            await RecommendService.fileManager2.deleteImage(fileName);
        }

        await RecommendService.service.delete(id);
    }
}