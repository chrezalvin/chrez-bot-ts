"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendService = void 0;
const debug = require('debug')('Server:recommend');
const _library_1 = require("../library");
const _library_2 = require("../library");
const FileManagerFirebase_1 = require("../library/FileManagerFirebase");
const _models_1 = require("../models");
class RecommendService {
    static async changeImgUrlToUrl(recommend) {
        return recommend.imgUrl ? { ...recommend, imgUrl: await RecommendService.fileManager2.translateToUrl(recommend.imgUrl) } : { ...recommend, id: recommend.id };
    }
    static async getAlldata() {
        const res = await RecommendService.service.getAll();
        return Promise.all(res.map(async (val) => await RecommendService.changeImgUrlToUrl(val)));
    }
    static async getRandomRecommend() {
        const recommends = RecommendService.service.cache;
        const recommend = recommends[(0, _library_1.rngInt)(0, recommends.length - 1)];
        return await RecommendService.changeImgUrlToUrl(recommend);
    }
    static async createNewrecommend(recommend, imgUrl) {
        // load the recommended first without the imgUrl
        const rec = {
            title: recommend.title,
            description: recommend.description,
        };
        if (recommend.link)
            rec.link = recommend.link;
        if (recommend.category)
            rec.category = recommend.category;
        const newRecommend = await RecommendService.service.add(rec);
        if (!newRecommend)
            throw new Error("Failed to create new recommend");
        // then upload the image
        if (imgUrl) {
            const res = await RecommendService.fileManager2.uploadImage(imgUrl);
            const data = await RecommendService.service.update(newRecommend.id, { ...recommend, imgUrl: res?.metadata.name });
            if (data)
                newRecommend.imgUrl = data.imgUrl;
        }
        return RecommendService.changeImgUrlToUrl(newRecommend);
    }
    static async deleteRecommend(id) {
        const rec = await RecommendService.service.get(id);
        if (!rec)
            throw new Error("Recommend not found");
        await RecommendService.service.delete(rec.id);
        if (rec.imgUrl)
            await RecommendService.fileManager2.deleteImage(rec.imgUrl);
    }
}
exports.RecommendService = RecommendService;
RecommendService.recommendedPath = "recommend";
RecommendService.bucket = "images";
RecommendService.recommend = "recommend";
RecommendService.firebaseImgPath = "images/recommend";
RecommendService.service = new _library_2.ServiceSupabase("id", RecommendService.recommend, { typeGuard: _models_1.isRecommend, });
// public static fileManager = new FileManagerSupabase(RecommendService.bucket, RecommendService.recommendedPath);
RecommendService.fileManager2 = new FileManagerFirebase_1.FileManagerFirebase(RecommendService.firebaseImgPath);
//# sourceMappingURL=recommend.js.map