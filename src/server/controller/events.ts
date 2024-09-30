const debug = require("debug")("Server:events");

import { Request, Response } from 'express';
import { EventService } from 'services/events';

export const events_get = async (req: Request, res: Response) => {
    const events = await EventService.getActiveEvent();
    res.send(events);
}

export const events_add_event = async (req: Request, res: Response) => {
    res.send({});
}

export const events_get_all = async (req: Request, res: Response) => {
    const events = await EventService.allEvents();
    res.send(events);
}