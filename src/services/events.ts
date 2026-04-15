import { ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { Event, isEvent } from "@models";
import { supabase } from "@shared/supabase";

export class EventService {
    protected static readonly eventPath: string = "events";
    protected static readonly eventImgPath: string = "images/events";
    protected static readonly eventBucket: string = "images";

    static eventManager = new ServiceFileSupabase<Event, "event_id", never, "img_path">(
        supabase,
        "event_id", 
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
                .ilike("title", `%${name}%`)
                .limit(1)
                .single()
            );

        if(Array.isArray(found))
            throw new Error("Failed to get events");

        return found;
    }

    static async getEvent(id: Event["event_id"]): Promise<Event>{
        return await EventService.eventManager.get(id);
    }

    /**
     * gets the event currently active based on current date
     * @returns 
     */
    static async getActiveEvent(): Promise<Event[]>{
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();
        
        // get events this month
        const res = await EventService
            .eventManager
            .queryBuilder((query) => query
                .lte("start_month", currentMonth)
                .gte("end_month", currentMonth)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get events");

        // filter events that are active based on day
        const activeEvents = res.filter((event) => {
            // remove event that doesn't have start_day or end_day
            if(!event.start_day || !event.end_day)
                return false;

            return EventService.isEventFallInBetween(
                event.start_day, 
                event.start_month,
                event.end_day,
                event.end_month,
                currentDay,
                currentMonth
            )
        });

        return activeEvents;
    }

    static async addEvent(event: StrictOmit<Event, "event_id" | "img_path">, imageBlob?: Blob): Promise<Event>{
        const fileName = event.title.replace(/\s/g, "_").toLowerCase();

        const newEvent = await EventService.eventManager.add(event, {
            file: imageBlob ?? null,
            fileName: fileName,
        });

        return newEvent;
    }

    static async updateEvent(id: Event["event_id"], event: Partial<StrictOmit<Event, "event_id" | "img_path">>, imageBlob?: Blob): Promise<Event>{
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

    static async deleteEvent(id: Event["event_id"]): Promise<void>{
        await EventService.eventManager.delete(id);
    }

    private static isEventFallInBetween(
        start_day: number, 
        start_month: number, 
        end_day: number, 
        end_month: number, 
        current_day: number, 
        current_month: number
    ): boolean{
        const startDate = new Date(2000, start_month - 1, start_day);
        const endDate = new Date(2000, end_month - 1, end_day);
        const currentDate = new Date(2000, current_month - 1, current_day);

        if (startDate <= endDate)
            return currentDate >= startDate && currentDate <= endDate;
        else
            return currentDate >= startDate || currentDate <= endDate;
    }
}

export default EventService;