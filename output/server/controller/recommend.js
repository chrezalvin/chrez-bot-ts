"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommend_post_update = exports.recommend_post_delete = exports.recommend_post_add = exports.recommend_get_by_id = exports.recommend_get_default = void 0;
const debug = require("debug")("Server:events");
const _models_1 = require("../../models");
const recommend_1 = require("../../services/recommend");
const recommend_get_default = async (req, res) => {
    const recommend = await recommend_1.RecommendService.getAlldata();
    res.json(recommend);
};
exports.recommend_get_default = recommend_get_default;
const recommend_get_by_id = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        throw new Error("Invalid id!");
    const recommend = await recommend_1.RecommendService.service.get(id);
    res.json(recommend);
};
exports.recommend_get_by_id = recommend_get_by_id;
// export const recommend_get_by_page = async (req: Request, res: Response) => {
//     debug("GET /recommend");
//     const page = parseInt(req.params.page);
//     if(isNaN(page))
//         throw new Error("Invalid page number!");
//     const recommend = await getRecommend(page);
//     res.json(recommend);
// }
const recommend_post_add = async (req, res) => {
    const param = req.body.recommend;
    if (typeof param !== "string")
        throw new Error("Invalid recommend object!");
    const recommend = JSON.parse(param);
    if (!(0, _models_1.isRecommend)(recommend))
        throw new Error("Invalid recommend object!");
    // TODO: add image parameter on post request
    const newRecommend = await recommend_1.RecommendService.createNewrecommend(recommend);
    res.status(200).json(newRecommend);
};
exports.recommend_post_add = recommend_post_add;
const recommend_post_delete = async (req, res) => {
    const id = parseInt(req.body.id);
    if (isNaN(id))
        throw new Error("Invalid id!");
    await recommend_1.RecommendService.service.delete(id);
    res.status(200).json({
        message: "Recommend deleted!"
    });
};
exports.recommend_post_delete = recommend_post_delete;
const recommend_post_update = async (req, res) => {
    const id = parseInt(req.body.id);
    const recommend = req.body.recommend;
    if (!(0, _models_1.isRecommend)(recommend))
        throw new Error("Invalid recommend object!");
    if (isNaN(id))
        throw new Error("Invalid id!");
    await recommend_1.RecommendService.service.update(id, recommend);
    res.status(200).json({
        message: "Recommend updated!"
    });
};
exports.recommend_post_update = recommend_post_update;
//# sourceMappingURL=recommend.js.map