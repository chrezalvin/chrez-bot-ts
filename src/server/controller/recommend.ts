const debug = require("debug")("Server:events");

import { Request, Response } from 'express';
import { isRecommendWithoutId, Recommend } from '@models';
import { RecommendService } from 'services/recommend';
import fs from "fs";

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

export const recommend_post_add = async (req: Request, res: Response) => {
    const recommend = JSON.parse(req.body.recommend);
    const image = req.file;

    console.log(recommend);

    if(!isRecommendWithoutId(recommend))
        throw new Error("Invalid recommend object!");

    let newRecommend: Recommend;
    if(image){
        const buffer = fs.readFileSync(image.path);
        const blob = new Blob([buffer], {type: image.mimetype});

        newRecommend = await RecommendService.createNewRecommend(recommend, blob);

        fs.unlinkSync(image.path);
    }
    else
        newRecommend = await RecommendService.createNewRecommend(recommend);

    res.status(200).json(newRecommend);
}

export const recommend_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    
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

    if(isNaN(id))
        throw new Error("Invalid id!");

    if(!isRecommendWithoutId(recommend))
        throw new Error("Invalid recommend object!");

    let updatedRecommend: Recommend;
    if(image){
        const buffer = fs.readFileSync(image.path);
        const blob = new Blob([buffer], {type: image.mimetype});

        updatedRecommend = await RecommendService.updateRecommend(id, recommend, blob);

        fs.unlinkSync(image.path);
    }
    else
        updatedRecommend = await RecommendService.updateRecommend(id, recommend);

    res.status(200).json(updatedRecommend);
}