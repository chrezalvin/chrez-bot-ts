const debug = require("debug")("Server:events");

import { Request, Response } from 'express';
import { isRecommend } from '@models';
import { RecommendService } from 'services/recommend';

export const recommend_get_default = async (req: Request, res: Response) => {
    const recommend = await RecommendService.getAlldata();

    res.json(recommend);
}

export const recommend_get_by_id = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if(isNaN(id))
        throw new Error("Invalid id!");

    const recommend = await RecommendService.service.get(id);

    res.json(recommend);
}

// export const recommend_get_by_page = async (req: Request, res: Response) => {
//     debug("GET /recommend");
//     const page = parseInt(req.params.page);

//     if(isNaN(page))
//         throw new Error("Invalid page number!");

//     const recommend = await getRecommend(page);

//     res.json(recommend);
// }

export const recommend_post_add = async (req: Request, res: Response) => {
    const param = req.body.recommend as unknown;

    if(typeof param !== "string")
        throw new Error("Invalid recommend object!");

    const recommend = JSON.parse(param);

    if(!isRecommend(recommend))
        throw new Error("Invalid recommend object!");

    // TODO: add image parameter on post request
    const newRecommend = await RecommendService.createNewrecommend(recommend, /* recommend.imgUrl */);

    res.status(200).json(newRecommend);
}

export const recommend_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    
    if(isNaN(id))
        throw new Error("Invalid id!");

    await RecommendService.service.delete(id);

    res.status(200).json({
        message: "Recommend deleted!"
    });
}

export const recommend_post_update = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const recommend = req.body.recommend as unknown;

    if(!isRecommend(recommend))
        throw new Error("Invalid recommend object!");
    if(isNaN(id))
        throw new Error("Invalid id!");

    await RecommendService.service.update(id, recommend);

    res.status(200).json({
        message: "Recommend updated!"
    });
}