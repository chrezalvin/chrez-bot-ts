const debug = require('debug')('Server:cursed');

import { Request, Response } from 'express';
import { CursedService } from 'services/cursed';

export const cursed_get = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.index);
    debug(`getting cursed with id: ${id}`);

    let url: string = await CursedService.getCursedUrl(isNaN(id) ? undefined : id );

    res.json({url});
}