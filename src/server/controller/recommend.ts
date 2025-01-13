const debug = require("debug")("Server:events");

import { Request, Response } from 'express';
import { isRecommendWithoutId } from '@models';
import { RecommendService } from 'services/recommend';

export const recommend_get_default = async (_: Request, res: Response) => {
    debug("getting all recommend");

    const recommend = await RecommendService.getAlldata();

    res.json(recommend);
}

export const recommend_get_by_id = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    debug(`getting recommend with id: ${id}`);

    if(isNaN(id))
        throw new Error("Invalid id!");

    const recommend = await RecommendService.recommendSupabase.get(id);

    res.json(recommend);
}

export const recommend_post_add = async (req: Request, res: Response) => {
    const recommend = JSON.parse(req.body.recommend);
    const image = req.file;

    debug(`adding recommend ${image && "with image"}`);

    if(!isRecommendWithoutId(recommend))
        throw new Error("Invalid recommend object!");

    const blob = image ? new Blob([image.buffer], {type: image.mimetype}) : undefined;
    let newRecommend = await RecommendService.createNewRecommend(recommend, blob);

    res.status(200).json(newRecommend);
}

export const recommend_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);

    debug(`deleting recommend with id: ${id}`);
    
    if(isNaN(id))
        throw new Error("Invalid id!");

    await RecommendService.deleteRecommend(id);

    res.status(200).json({
        message: "Recommend deleted!"
    });
}

export const recommend_post_update = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const recommend = JSON.parse(req.body.recommend);
    const image = req.file;

    debug(`updating recommend with id: ${id}`);

    if(isNaN(id))
        throw new Error("Invalid id!");

    if(!isRecommendWithoutId(recommend))
        throw new Error("Invalid recommend object!");

    const blob = image ? new Blob([image.buffer], {type: image.mimetype}) : undefined;
    let updatedRecommend = await RecommendService.updateRecommend(id, recommend, blob);

    res.status(200).json(updatedRecommend);
}