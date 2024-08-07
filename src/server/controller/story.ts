import { StoryService } from "@services";
import { Request, Response } from "express";

export const story_get_default = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if(isNaN(id))
        throw new Error("Invalid id!");
    
    const recommend = await StoryService.getStory(id);

    res.json(recommend);
}

export const story_get_random = async (req: Request, res: Response) => {
    const recommend = StoryService.getRandomStory();

    res.json(recommend);
}