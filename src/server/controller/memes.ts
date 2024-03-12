const debug = require('debug')('Server:memes');

import { Request, Response } from 'express';
import { MemeService } from 'services/memes';

export const memes_get = async (req: Request, res: Response) => {
    debug('GET /');

    const id: number = parseInt(req.query.id as string);
    const nsfw: boolean = req.query.nsfw === "1";

    let url: string = isNaN(id) ? await MemeService.getMemeUrl(nsfw) : await MemeService.getMemeUrl(nsfw, id);

    res.json({url});
}