const debug = require('debug')('Server:memes');

import { Request, Response } from 'express';
import { MemeService } from 'services/memes';

export const memes_get = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const nsfw: boolean = req.query.nsfw === "1";
    
    let url: string = await (isNaN(id) ? MemeService.getMemeUrl(nsfw) : MemeService.getMemeUrl(nsfw, id));
    
    res.json({url});
}