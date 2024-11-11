import { isYomamaWithoutId } from '@models';
import YomamaService from '@services/yomama';
import { Request, Response } from 'express';

export const yomama_get_all = async (req: Request, res: Response) => {
    const yomamas = await YomamaService.getAllYomama();

    res.json(yomamas);
}

export const yomama_post_add = async (req: Request, res: Response) => {
    const yomama = req.body.yomama as unknown;

    console.log(yomama);

    if(!isYomamaWithoutId(yomama))
        throw new Error("invalid yomama object");

    const newYomama = await YomamaService.addYomama(yomama);

    if(!newYomama)
        throw new Error("Failed to add new yomama joke");

    res.status(200).json(newYomama);
}

export const yomama_post_edit = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const yomama = req.body.yomama as unknown;

    if(isNaN(id) || !isYomamaWithoutId(yomama))
        throw new Error("invalid yomama object");

    const newYomama = await YomamaService.updateYomama(id, yomama);

    if(!newYomama)
        throw new Error("yomama joke not found");

    res.status(200).json(newYomama);
}

export const yomama_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);

    if(isNaN(id))
        throw new Error("Invalid id!");

    await YomamaService.deleteYomama(id);

    res.status(200).json({success: true});
}