const debug = require('debug')('Server:events');

import { FileManagerFirebase, ServiceSupabase } from "@library";
import { ActiveEvent, isActiveEvent } from "@models";

export class ActiveEventService {
    protected static readonly activeEventPath: string = "active_events";
    protected static readonly activeEventImgPath: string = "images/active_events";

    static activeEventManager = new ServiceSupabase<ActiveEvent, "id">("id", ActiveEventService.activeEventPath, {
        typeGuard: isActiveEvent,
        useCache: false,
    });

    static fileManager = new FileManagerFirebase("");

    static async translateImageToUrl<_T extends string | ActiveEvent, _R = _T extends string ? string : ActiveEvent>(eventOrPath: _T): Promise<_R>{
        if(typeof eventOrPath === "string")
            return await ActiveEventService.fileManager.getUrlFromPath(eventOrPath) as _R;
        else if (typeof eventOrPath === "object"){
            if(eventOrPath.img_path)
                return {...eventOrPath, img_path: eventOrPath.img_path && await ActiveEventService.fileManager.getUrlFromPath(eventOrPath.img_path)} as _R;
            else
                return eventOrPath as _R;
        }
        else 
            throw Error("Never");
    }

    static async getEventList(): Promise<ActiveEvent[]>{
        return await Promise.all(ActiveEventService
            .activeEventManager
            .cache
            .map(ActiveEventService.translateImageToUrl));
    }

    static async allEvents(): Promise<ActiveEvent[]>{
        const res = await ActiveEventService.activeEventManager.getAll();

        return await Promise.all(res.map(ActiveEventService.translateImageToUrl));
    }

    static async getEventByMonth(month?: number): Promise<ActiveEvent[]>{
        // if month is not provided, get the current month
        const currentMonth = new Date().getMonth() + 1;

        const res = await ActiveEventService
            .activeEventManager
            .client
            .select("*")
            .or(`start_month.eq.${month || currentMonth},end_month.eq.${month || currentMonth}`);

        if(res.error)
            throw new Error(res.error.message);

        const events = res.data.filter(isActiveEvent);

        return await Promise.all(events.map(ActiveEventService.translateImageToUrl));
    }

    static async getEventByName(name: string): Promise<ActiveEvent | undefined>{
        const res = await ActiveEventService.activeEventManager
            .client
            .select("*")
            .eq("name", name);

        if(res.error)
            throw new Error(res.error.message);

        if(res.data.length === 0)
            return undefined;

        return await ActiveEventService.translateImageToUrl(res.data[0]);
    }

    static getEventById(id: number){
        return ActiveEventService.activeEventManager.get(id);
    }

    static async getActiveEvent(): Promise<ActiveEvent[]>{
        const date = new Date().toISOString();
        const res = await ActiveEventService
            .activeEventManager
            .client
            .select("*")
            .eq("event_type", 2)
            .lte("start_date", date)
            .gte("end_date", date);

        if(res.error)
            throw new Error(res.error.message);

        return await Promise.all(res.data.filter(isActiveEvent).map(ActiveEventService.translateImageToUrl));
    }

    /**
     * get all incoming events from now to maxDayFromNow, defaults to 7 days from now
     * @param maxDayFromNow 
     */
    static async getIncomingEvent(maxDayFromNow: number = 7): Promise<ActiveEvent[]>{
        const date = new Date().toISOString();
        const endDate = new Date(new Date().getTime() + maxDayFromNow * 24 * 60 * 60 * 1000).toISOString();
        const res = await ActiveEventService
            .activeEventManager
            .client
            .select("*")
            .eq("event_type", 3)
            .gte("start_date", date)
            .lte("start_date", endDate);

        if(res.error)
            throw new Error(res.error.message);

        return await Promise.all(res.data.filter(isActiveEvent).map(ActiveEventService.translateImageToUrl));
    }
}

export default ActiveEventService;