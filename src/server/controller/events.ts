const debug = require("debug")("ChrezBot:server:events");

import { Request, Response } from 'express';
import { addEventByMonth, getEventByMonth } from 'services/events';

const monthNames = [
    "january", "february", "march", "april", "may", "june", 
    "july", "august", "september", "october", "november", "december"
];

export const events_get = async (req: Request, res: Response) => {
    try{
        let month: string = req.params.monthName ?? monthNames[new Date().getMonth()];

        if(!monthNames.includes(month))
            return res.send({error: 1, message: "Invalid month name"});

        const event = await getEventByMonth(month);

        res.send(event);
    }
    catch(err){
        res.send(err);
    }
}

export const events_add_event = async (req: Request, res: Response) => {
    try{
        debug(req.body);

        const reqMonth = req.body.month as unknown;
        const reqEventName = req.body.eventName as unknown;
        const reqEventDescription = req.body.eventDescription as unknown;

        if(reqMonth == null || typeof reqMonth !== "string")
            return res.send({error: 1, message: "Invalid month name"});
        if(reqEventName == null || typeof reqEventName !== "string")
            return res.send({error: 1, message: "Invalid event name"});
        if(reqEventDescription == null || typeof reqEventDescription !== "string")
            return res.send({error: 1, message: "Invalid event description"});

        const month = reqMonth.toLowerCase();

        if(!monthNames.includes(month))
            return res.send({error: 1, message: "Invalid month name"});
        else{
            await addEventByMonth(month, {name: reqEventName, description: reqEventDescription});
            res.send({message: "Event added!"});
        }
    }
    catch(err){
        res.send(err);
    }
}