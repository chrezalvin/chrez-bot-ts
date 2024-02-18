const debug = require('debug')('Server:cursed');

import { Request, Response } from 'express';
import { getCursedUrl, getRandomCursedUrl } from 'services/cursed';

export const cursed_get = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.index);

    let url: string = await (isNaN(id) ? getRandomCursedUrl() : getCursedUrl(id));

    res.json({url});
}