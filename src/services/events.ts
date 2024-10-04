const debug = require('debug')('Server:events');

import { FileManagerFirebase, ServiceSupabase } from "@library";
import { Event, isEvent } from "@models";

export class EventService {
    protected static readonly eventPath: string = "events";

    static eventManager = new ServiceSupabase<Event, "id">("id", EventService.eventPath, {
        typeGuard: isEvent
    });

    static fileManager = new FileManagerFirebase("");

    static async translateImageToUrl<_T extends string | Event, _R = _T extends string ? string : Event>(eventOrPath: _T): Promise<_R>{
        if(typeof eventOrPath === "string")
            return await EventService.fileManager.getUrlFromPath(eventOrPath) as _R;
        else if (typeof eventOrPath === "object")
            return {...eventOrPath, img_path: eventOrPath.img_path && await EventService.fileManager.getUrlFromPath(eventOrPath.img_path)} as _R;
        else 
            throw Error("Never");
    }

    static async getEventList(): Promise<Event[]>{
        return await Promise.all(EventService
            .eventManager
            .cache
            .map(EventService.translateImageToUrl));
    }

    static async allEvents(): Promise<Event[]>{
        const res = await EventService.eventManager.getAll();

        return await Promise.all(res.map(EventService.translateImageToUrl));
    }

    static async getEventByMonth(month?: number): Promise<Event[]>{
        // if month is not provided, get the current month
        const currentMonth = new Date().getMonth() + 1;

        const res = await EventService
            .eventManager
            .client
            .select("*")
            .or(`start_month.eq.${month || currentMonth},end_month.eq.${month || currentMonth}`);

        if(res.error)
            throw new Error(res.error.message);

        const events = res.data.filter(isEvent);

        return await Promise.all(events.map(EventService.translateImageToUrl));
    }

    static async getEventByName(name: string): Promise<Event | undefined>{
        const found = EventService.eventManager.cache.find(e => e.title.match(new RegExp(name, "i")));

        return found ? await EventService.translateImageToUrl(found) : undefined;
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