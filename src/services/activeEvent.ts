import { FileManagerFirebase, ServiceSupabase } from "@library";
import { ActiveEvent, isActiveEvent } from "@models";

export class ActiveEventService {
    protected static readonly activeEventPath: string = "active_events";
    protected static readonly activeEventImgPath: string = "images/active_events";

    static activeEventManager = new ServiceSupabase<ActiveEvent, "id">("id", ActiveEventService.activeEventPath, {
        typeGuard: isActiveEvent,
        useCache: true,
    });

    static fileManager = new FileManagerFirebase(ActiveEventService.activeEventImgPath);

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

    static async getEventByName(name: string): Promise<ActiveEvent[]>{
        const res = ActiveEventService
            .activeEventManager
            .getWhere((pred) => pred.title.toLowerCase() == name.toLowerCase());

        return await Promise.all(res.map(ev => ActiveEventService.translateImageToUrl(ev)));
    }

    static async getEventById(id: number): Promise<ActiveEvent>{
        const event = await ActiveEventService.activeEventManager.get(id);

        if(!event)
            throw new Error("Event not found");

        return await ActiveEventService.translateImageToUrl(event);
    }

    static async getAllActiveEvents(): Promise<ActiveEvent[]>{
        const res = await ActiveEventService.activeEventManager.getAll();

        return Promise.all(res.map(ActiveEventService.translateImageToUrl));
    }

    static async getOngoingActiveEvent(): Promise<ActiveEvent[]>{
        const date = new Date().toLocaleString();
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

        return Promise.all(res.map(ActiveEventService.translateImageToUrl));
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

        return await Promise.all(res.map(ActiveEventService.translateImageToUrl));
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

        return await Promise.all(res.map(ActiveEventService.translateImageToUrl));
    }

    static async createNewEvent(event: Omit<ActiveEvent, "id" | "img_path">, imgBlob?: Blob): Promise<ActiveEvent>{
        // load the event first without the imgUrl
        const newEvent = await ActiveEventService.activeEventManager.add({...event, img_path: null});

        if(!newEvent)
            throw new Error("Failed to create new event");

        if(!imgBlob)
            return await ActiveEventService.translateImageToUrl(newEvent);
        
        const fileName: string = newEvent.title.toLowerCase().replace(/ /g, "_");
        const res = await ActiveEventService.fileManager.uploadImage(imgBlob, fileName);

        if(!res)
            throw new Error("Failed to upload image");

        const data = await ActiveEventService.activeEventManager.update(newEvent.id, {img_path: res.metadata.fullPath});

        if(data)
            newEvent.img_path = data.img_path;

        return await ActiveEventService.translateImageToUrl(newEvent);
    }

    static async updateEvent(id: ActiveEvent["id"], event: Partial<Omit<ActiveEvent, "id" | "img_path">>, imgBlob?: Blob): Promise<ActiveEvent>{
        const activeEvent = await ActiveEventService.activeEventManager.get(id);

        if(!activeEvent)
            throw new Error("Active Event not found!");

        const updatedEvent = await ActiveEventService.activeEventManager.update(id, event);

        if(!updatedEvent)
            throw new Error("Failed to update Active Event!");

        if(!imgBlob)
            return ActiveEventService.translateImageToUrl(updatedEvent);

        if(activeEvent.img_path){
            const fileName = activeEvent.img_path.split("/").pop();
            
            if(!fileName)
                throw new Error("Failed to get image name!");
            
            await ActiveEventService.fileManager.deleteImage(fileName);
        }

        let fileName: string;
        if(event.title)
            fileName = event.title.toLowerCase().replace(/ /g, "_");
        else
            fileName = activeEvent.title.toLowerCase().replace(/ /g, "_");

        const fileNameRes =  await ActiveEventService.fileManager.uploadImage(imgBlob, fileName);

        if(!fileNameRes)
            throw new Error("Failed to upload image!");

        const updatedActiveEvent = await ActiveEventService.activeEventManager.update(id, {img_path: fileNameRes.metadata.fullPath});

        if(!updatedActiveEvent)
            throw new Error("Failed to update Active Event!");

        return await ActiveEventService.translateImageToUrl(updatedActiveEvent);
    }

    static async deleteEvent(id: ActiveEvent["id"]): Promise<void>{
        const activeEvent = await ActiveEventService.activeEventManager.get(id);

        if(!activeEvent)
            throw new Error("Active Event not found!");

        if(activeEvent.img_path){
            const fileName = activeEvent.img_path.split("/").pop();

            if(!fileName)
                throw new Error("Failed to get image name!");

            await ActiveEventService.fileManager.deleteImage(fileName);
        }

        await ActiveEventService.activeEventManager.delete(id);
    }
}

export default ActiveEventService;