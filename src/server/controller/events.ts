const debug = require("debug")("Server:events");

import { Request, Response } from 'express';
import { EventService } from 'services/events';

export const events_get = async (_: Request, res: Response) => {
    debug("getting all active event");

    const events = await EventService.getActiveEvent();
    res.send(events);
}

export const events_add_event = async (_: Request, res: Response) => {
    debug("[unimplemented] adding event");

    res.send({});
}

export const events_get_all = async (_: Request, res: Response) => {
    debug("getting all events");

    const events = await EventService.allEvents();
    res.send(events);
}