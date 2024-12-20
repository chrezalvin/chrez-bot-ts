const debug = require('debug')('Server:Yomama');

import { isYomamaWithoutId } from '@models';
import YomamaService from '@services/yomama';
import { Request, Response } from 'express';

export const yomama_get_all = async (_: Request, res: Response) => {
    debug("getting all yomama jokes");

    const yomamas = await YomamaService.getAllYomama();

    res.json(yomamas);
}

export const yomama_post_add = async (req: Request, res: Response) => {
    debug("adding new yomama joke");

    const yomama = req.body.yomama as unknown;

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

    debug(`editing yomama joke with id: ${id}`);

    if(isNaN(id) || !isYomamaWithoutId(yomama))
        throw new Error("invalid yomama object");

    const newYomama = await YomamaService.updateYomama(id, yomama);

    if(!newYomama)
        throw new Error("yomama joke not found");

    res.status(200).json(newYomama);
}

export const yomama_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);

    debug(`deleting yomama joke with id: ${id}`);

    if(isNaN(id))
        throw new Error("Invalid id!");

    await YomamaService.deleteYomama(id);

    res.status(200).json({success: true});
}