import { getCurrentTime, ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { ActiveEvent, isActiveEvent } from "@models";
import { supabase } from "@shared/supabase";

export class ActiveEventService {
    protected static readonly activeEventPath: string = "active_events";
    protected static readonly activeEventImgPath: string = "images/active_events";
    protected static readonly activeEventBucket: string = "images";

    static activeEventManager = new ServiceFileSupabase<ActiveEvent, "active_event_id", never, "img_path">(
        supabase,
        "active_event_id", {
        tableName: ActiveEventService.activeEventPath,
        typeGuard: isActiveEvent,
        useCache: true,
    }, {
        bucketName: ActiveEventService.activeEventBucket,
        storagePath: ActiveEventService.activeEventImgPath,
        fileKey: "img_path",
    });

    static async getEventList(): Promise<ActiveEvent[]>{
        return await ActiveEventService.activeEventManager.getAll();
    }

    static async allEvents(): Promise<ActiveEvent[]>{
        return await ActiveEventService.activeEventManager.getAll();
    }

    static async getEventByName(name: string): Promise<ActiveEvent[]>{
        const events = await ActiveEventService
            .activeEventManager
            .queryBuilder((query) => query
                .ilike("title", `%${name}%`)
            );

        if(!Array.isArray(events))
            throw new Error("Failed to get events");

        return events;
    }

    static async getEventById(id: ActiveEvent["active_event_id"]): Promise<ActiveEvent>{
        const event = await ActiveEventService
            .activeEventManager
            .get(id);

        return event;
    }

    static async getAllActiveEvents(): Promise<ActiveEvent[]>{
        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder(query => query.order("start_date", { ascending: false }));

        if(!Array.isArray(res))
            throw new Error("Failed to get active events");

        return res;
    }

    static async getOngoingActiveEvent(): Promise<ActiveEvent[]>{
        const date = getCurrentTime();
        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder((query => query
                    .lte("start_date", date)
                    .gte("end_date", date)
                )
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get active events");

        return res;
    }

    static async getActiveEventByName(name: ActiveEvent["title"]): Promise<ActiveEvent[]>{
        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder(query => query
                .ilike("title", `%${name}%`)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get active events");

        return res;
    }

    /**
     * get all incoming events from now
     */
    static async getIncomingEvent(): Promise<ActiveEvent[]>{
        const date = getCurrentTime();

        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder(query => query
                .is("end_date", null)
                .gte("start_date", date)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get incoming events");

        return res;
    }

    static async createNewEvent(event: StrictOmit<ActiveEvent, "active_event_id" | "img_path">, imgBlob?: Blob): Promise<ActiveEvent>{
        // load the event first without the imgUrl
        const fileName: string = event.title.toLowerCase().replace(/ /g, "_");
        
        const newEvent = await ActiveEventService
            .activeEventManager
            .add(event, {
                file: imgBlob ?? null,
                fileName
            });

        return newEvent;
    }

    static async updateEvent(
        id: ActiveEvent["active_event_id"], 
        event: Partial<StrictOmit<ActiveEvent, "active_event_id" | "img_path">>, 
        imgBlob?: Blob
    ): Promise<ActiveEvent>{
        const resEvent = await ActiveEventService.activeEventManager.get(id);
        const newFileName = (event.title ?? resEvent.title).toLowerCase().replace(/ /g, "_");

        if(imgBlob)
            return await ActiveEventService
                .activeEventManager
                .update(id, event, {file: imgBlob, fileName: newFileName});
        else
            return await ActiveEventService
                .activeEventManager
                .update(id, event);
    }

    static async deleteEvent(id: ActiveEvent["active_event_id"]): Promise<void>{
        await ActiveEventService.activeEventManager.delete(id);
    }
}

export default ActiveEventService;