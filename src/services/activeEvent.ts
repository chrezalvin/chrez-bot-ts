import { ServiceFileSupabase } from "@library";
import { ActiveEvent, isActiveEvent } from "@models";

export class ActiveEventService {
    protected static readonly activeEventPath: string = "active_events";
    protected static readonly activeEventImgPath: string = "images/active_events";
    protected static readonly activeEventBucket: string = "images";

    static activeEventManager = new ServiceFileSupabase<ActiveEvent, "id", never, "img_path">("id", {
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
                .select("*")
                .ilike("title", `%${name}%`)
            );

        if(!Array.isArray(events))
            throw new Error("Failed to get events");

        return events;
    }

    static async getEventById(id: number): Promise<ActiveEvent>{
        const event = await ActiveEventService
            .activeEventManager
            .get(id);

        return event;
    }

    static async getAllActiveEvents(): Promise<ActiveEvent[]>{
        const res = await ActiveEventService
            .activeEventManager
            .getAll();

        return res;
    }

    static async getActiveEvent(): Promise<ActiveEvent[]>{
        const date = new Date().toISOString();
        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder((query => query
                    .select("*")
                    .lte("start_date", date)
                    .gte("end_date", date)
                )
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get active events");

        return res;
    }

    static async getActiveEventByName(name: string): Promise<ActiveEvent[]>{
        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder(query => query
                .select("*")
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
        const date = (new Date()).toISOString();

        const res = await ActiveEventService
            .activeEventManager
            .queryBuilder(query => query
                .select("*")
                .is("end_date", null)
                .gte("start_date", date)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get incoming events");

        return res;
    }

    static async createNewEvent(event: Omit<ActiveEvent, "id" | "img_path">, imgBlob?: Blob): Promise<ActiveEvent>{
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

    static async updateEvent(id: ActiveEvent["id"], event: Partial<Omit<ActiveEvent, "id" | "img_path">>, imgBlob?: Blob): Promise<ActiveEvent>{
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

    static async deleteEvent(id: ActiveEvent["id"]): Promise<void>{
        await ActiveEventService.activeEventManager.delete(id);
    }
}

export default ActiveEventService;