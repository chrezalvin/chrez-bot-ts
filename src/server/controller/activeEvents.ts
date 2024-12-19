import { ActiveEvent, isActiveEventWithoutId, isPartialActiveEvent } from '@models';
import { ActiveEventService } from '@services';
import { Request, Response } from 'express';
import fs from "fs";

export const activeEvents_get_all = async (req: Request, res: Response) => {
    const name = req.query.name as unknown;

    if(typeof name === "string" && name.length < 5)
        throw new Error("Search query is too short");

    let activeEvents: ActiveEvent[];

    if(typeof name === "string")
        activeEvents = await ActiveEventService.getActiveEventByName(name);
    else
        activeEvents = await ActiveEventService.getAllActiveEvents();

    res.json(activeEvents);
}

export const activeEvents_get_current = async (_: Request, res: Response) => {
    const activeEvents = await ActiveEventService.getActiveEvent();

    res.json(activeEvents);
}

export const activeEvents_get_incoming = async (_: Request, res: Response) => {
    const activeEvents = await ActiveEventService.getIncomingEvent();

    res.json(activeEvents);
}

export const activeEvents_get_by_id = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if(isNaN(id))
        throw new Error("Invalid id");

    const activeEvent = await ActiveEventService.getEventById(id);

    if(!activeEvent)
        throw new Error("Event not found");

    res.json(activeEvent);
}

export const activeEvents_post_add = async (req: Request, res: Response) => {
    const activeEvent = JSON.parse(req.body.activeEvent);
    const image = req.file;

    console.log(activeEvent);

    if(!isActiveEventWithoutId(activeEvent))
        throw new Error("Invalid activeEvent object");

    let newActiveEvent: ActiveEvent;
    if(image){
        const buffer = fs.readFileSync(image.path);
        const blob = new Blob([buffer], {type: image.mimetype});

        newActiveEvent = await ActiveEventService.createNewEvent(activeEvent, blob); 
        fs.unlinkSync(image.path);
    }
    else
        newActiveEvent = await ActiveEventService.createNewEvent(activeEvent);

    res.status(200).json(newActiveEvent);
}

export const activeEvents_post_edit = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const activeEvent = JSON.parse(req.body.activeEvent);
    const image = req.file;

    if(isNaN(id))
        throw new Error("Invalid id");

    if(!isPartialActiveEvent(activeEvent))
        throw new Error("Invalid activeEvent object");

    let updatedActiveEvent: ActiveEvent;
    if(image){
        const buffer = fs.readFileSync(image.path);
        const blob = new Blob([buffer], {type: image.mimetype});

        updatedActiveEvent = await ActiveEventService.updateEvent(id, activeEvent, blob);

        fs.unlinkSync(image.path);
    }
    else
        updatedActiveEvent = await ActiveEventService.updateEvent(id, activeEvent);

    res.status(200).json(updatedActiveEvent);
}

export const activeEvents_post_delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body.id);

    if(isNaN(id))
        throw new Error("Invalid id");

    await ActiveEventService.deleteEvent(id);

    res.status(200).json({success: true});
}