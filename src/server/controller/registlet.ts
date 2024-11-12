const debug = require('debug')('Server:registlet');

import { isRegistletWithoutId, Registlet } from '@models';
import { RegistletService } from '@services';
import { Request, Response } from 'express';
import fs from "fs";

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

    let newRegistlet: Registlet;

    if(image){
        const buffer = fs.readFileSync(image.path);
        const blob = new Blob([buffer], {type: image.mimetype});

        newRegistlet = await RegistletService.setNewRegistlet(registlet, blob);

        fs.unlinkSync(image.path);
    }
    else
        newRegistlet = await RegistletService.setNewRegistlet(registlet);

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

    let updatedRegistlet: Registlet;
    if(image){
        const buffer = fs.readFileSync(image.path);
        const blob = new Blob([buffer], {type: image.mimetype});

        updatedRegistlet = await RegistletService.updateRegistlet(id, registlet, blob);

        fs.unlinkSync(image.path);
    }
    else
        updatedRegistlet = await RegistletService.updateRegistlet(id, registlet);

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