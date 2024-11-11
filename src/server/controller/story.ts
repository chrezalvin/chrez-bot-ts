import { isStory, isStoryWithoutId } from "@models";
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

export const story_get_all = async (req: Request, res: Response) => {
    const recommend = await StoryService.getAllStories();

    res.json(recommend);
}

export const story_post_add = async (req: Request, res: Response) => {
    const story = req.body.story as unknown;

    if(!isStoryWithoutId(story))
        throw new Error("invalid story object");

    const newStory = await StoryService.addStory(story);

    res.status(200).json(newStory);
}

export const story_post_edit = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const story = req.body.story as unknown;

    if(isNaN(id) || !isStoryWithoutId(story))
        throw new Error("invalid story object");

    const newStory = await StoryService.editStory(id, story);

    if(!newStory)
        throw new Error("story not found");

    res.status(200).json(newStory);
}

export const story_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    
    if(isNaN(id))
        throw new Error("Invalid id!");

    await StoryService.deleteStory(id);

    res.status(200).json({
        success: true
    });
}