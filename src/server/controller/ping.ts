const debug = require('debug')('Server:cursed');

import { Request, Response } from 'express';

export const ping_get = async (req: Request, res: Response) => {
    res.json({message: "pong"});
}