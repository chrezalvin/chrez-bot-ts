const debug = require("debug")("Server:events");

import { Request, Response } from 'express';
import { addRecommend, deleteRecommendById, getRecommend, isRecommend, updateCommandById } from 'services/recommend';

export const recommend_get_default = async (req: Request, res: Response) => {
    const recommend = await getRecommend();

    res.json(recommend);
}

export const recommend_get_by_page = async (req: Request, res: Response) => {
    debug("GET /recommend");
    const page = parseInt(req.params.page);

    if(isNaN(page))
        throw new Error("Invalid page number!");    

    const recommend = await getRecommend(page);

    res.json(recommend);
}

export const recommend_post_add = async (req: Request, res: Response) => {
    debug("POST /recommend/add");

    const param = req.body.recommend as unknown;

    if(typeof param !== "string")
        throw new Error("Invalid recommend object!");

    const recommend = JSON.parse(param);

    if(!isRecommend(recommend))
        throw new Error("Invalid recommend object!");

    await addRecommend(recommend);

    res.status(200);
}

export const recommend_post_delete = async (req: Request, res: Response) => {
    debug("POST /recommend/delete");

    const id = req.body.id as unknown;
    
    if(typeof id !== "string")
        throw new Error("Invalid id!");

    await deleteRecommendById(id);
}

export const recommend_post_update = async (req: Request, res: Response) => {
    debug("POST /recommend/update");

    const id = req.body.id as unknown;
    const recommend = req.body.recommend as unknown;

    if(!isRecommend(recommend))
        throw new Error("Invalid recommend object!");
    if(typeof id !== "string")
        throw new Error("Invalid id!");

    await updateCommandById(id, recommend);
}