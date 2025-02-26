const debug = require('debug')('Server:registlet');

import { isRegistletWithoutId } from '@models';
import { RegistletService } from '@services';
import { Request, Response } from 'express';

export const registlet_get_all = async (_: Request, res: Response) => {
    debug("getting all registlet");

    const registlets = await RegistletService.getAll();

    res.json(registlets);
}

export const registlet_search_get = async (req: Request, res: Response) => {
    const search = req.query.search as string;

    debug(`searching registlet with name: ${search}`);

    if(!search)
        throw new Error("Invalid search string");

    const registlets = await RegistletService.getRegistletByName(search);

    res.json(registlets);
}

export const registlet_post_add = async (req: Request, res: Response) => {
    const image = req.file;
    const registlet = JSON.parse(req.body.registlet);

    debug(`adding registlet ${image && "with image"}`);

    if(!isRegistletWithoutId(registlet))
        throw new Error("Invalid registlet object!");

    const blob = image ? new Blob([image.buffer], {type: image.mimetype}) : undefined;
    let newRegistlet = await RegistletService.setNewRegistlet(registlet, blob);

    res.status(200).json(newRegistlet);
}

export const registlet_post_edit = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const registlet = JSON.parse(req.body.registlet);
    const image = req.file;

    debug(`editing registlet with id: ${id}`);

    if(isNaN(id))
        throw new Error("Invalid id!");

    if(!isRegistletWithoutId(registlet))
        throw new Error("Invalid registlet object!");

    const blob = image ? new Blob([image.buffer], {type: image.mimetype}) : undefined;
    let updatedRegistlet = await RegistletService.updateRegistlet(id, registlet, blob);

    res.status(200).json(updatedRegistlet);
}

export const registlet_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);

    debug(`deleting registlet with id: ${id}`);

    if(isNaN(id))
        throw new Error("Invalid id!");

    await RegistletService.deleteRegistlet(id);

    res.status(200).json({success: true});
}