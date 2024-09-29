const debug = require('debug')('Server:events');

import { ServiceSupabase } from "@library";
import { Event, isEvent } from "@models";

export class EventService {
    protected static readonly eventPath: string = "events";
    
    static eventManager = new ServiceSupabase<Event, "id">("id", EventService.eventPath, {
        typeGuard: isEvent
    });

    static getEventList(){
        return EventService.eventManager.cache;
    }

    static async allEvents(){
        return await EventService.eventManager.getAll();
    }

    static getEvent(id: number){
        return EventService.eventManager.get(id);
    }

    static async getActiveEvent(): Promise<Event[]>{
        const date = new Date().toISOString();
        const res = await EventService
            .eventManager
            .client
            .select("*")
            .lte("start_date", date)
            .gte("end_date", date);

        if(res.error)
            throw new Error(res.error.message);

        return res.data.filter(isEvent);
    }
}

export default EventService;