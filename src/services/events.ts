import { ServiceFileSupabase } from "@library";
import { Event, isEvent } from "@models";

export class EventService {
    protected static readonly eventPath: string = "events";
    protected static readonly eventImgPath: string = "images/events";
    protected static readonly eventBucket: string = "images";

    static eventManager = new ServiceFileSupabase<Event, "id", never, "img_path">("id", 
        {
            tableName: EventService.eventPath,
            typeGuard: isEvent,
            useCache: true,
        },
        {
            bucketName: EventService.eventBucket,
            storagePath: EventService.eventImgPath,
            fileKey: "img_path",
        }
    );

    static async getEventList(): Promise<Event[]>{
        return await EventService.eventManager.getAll();
    }

    static async allEvents(): Promise<Event[]>{
        return await EventService.eventManager.getAll();
    }

    static async getEventByMonth(month?: number): Promise<Event[]>{
        // if month is not provided, get the current month
        const currentMonth = new Date().getMonth() + 1;

        const res = await EventService
            .eventManager
            .queryBuilder((query) => query
                .select("*")
                .or(`start_month.eq.${month || currentMonth},end_month.eq.${month || currentMonth}`)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get events");

        return res;
    }

    static async getEventByName(name: Event["title"]): Promise<Event | undefined>{
        const found = await EventService
            .eventManager
            .queryBuilder((query) => query
                .select("*")
                .ilike("title", `%${name}%`)
                .limit(1)
                .single()
            );

        if(Array.isArray(found))
            throw new Error("Failed to get events");

        return found;
    }

    static async getEvent(id: Event["id"]): Promise<Event>{
        return await EventService.eventManager.get(id);
    }

    static async getActiveEvent(): Promise<Event[]>{
        const date = new Date().toISOString();

        const res = await EventService
            .eventManager
            .queryBuilder((query) => query
                .select("*")
                .lte("start_date", date)
                .gte("end_date", date)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get active events");

        return res;
    }

    static async addEvent(event: Omit<Event, "id" | "img_path">, imageBlob?: Blob): Promise<Event>{
        const fileName = event.title.replace(/\s/g, "_").toLowerCase();

        const newEvent = await EventService.eventManager.add(event, {
            file: imageBlob ?? null,
            fileName: fileName,
        });

        return newEvent;
    }

    static async updateEvent(id: Event["id"], event: Partial<Omit<Event, "id" | "img_path">>, imageBlob?: Blob): Promise<Event>{
        const oldEvent = await EventService.eventManager.get(id);
        const fileName = (event.title ?? oldEvent.title).replace(/\s/g, "_").toLowerCase();

        if(imageBlob)
            return await EventService.eventManager.update(id, event, {
                file: imageBlob,
                fileName,
            });
        else
            return await EventService.eventManager.update(id, event);
    }

    static async deleteEvent(id: Event["id"]): Promise<void>{
        await EventService.eventManager.delete(id);
    }
}

export default EventService;