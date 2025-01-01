import { StrictOmit } from "@library/CustomTypes";

export interface Event{
    event_id: number;
    title: string;
    img_path: string | null;
    link: string | null;
    description: string | null;
    start_month: number;
    end_month: number;
    start_day: number | null;
    end_day: number | null;
    short_description: string | null;
}

export function isEvent(obj: unknown): obj is Event{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("event_id" in obj) || typeof obj.event_id !== "number") 
        return false;

    if(!("title" in obj) || typeof obj.title !== "string")
        return false;

    if(!("img_path" in obj) || (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    if(!("link" in obj) || (obj.link !== null && typeof obj.link !== "string"))
        return false;

    if(!("description" in obj) || (obj.description !== null && typeof obj.description !== "string"))
        return false;

    if(!("start_month" in obj) || typeof obj.start_month !== "number")
        return false;

    if(!("end_month" in obj) || typeof obj.end_month !== "number")
        return false;

    if(!("start_day" in obj) || (obj.start_day !== null && typeof obj.start_day !== "number"))
        return false;

    if(!("end_day" in obj) || (obj.end_day !== null && typeof obj.end_day !== "number"))
        return false;

    if(!("short_description" in obj) || (obj.short_description !== null && typeof obj.short_description !== "string"))
        return false;

    return true;
}

export function isEventWithoutId(obj: unknown): obj is StrictOmit<Event, "event_id">{
    if(typeof obj !== "object" || obj === null) return false;

    if("event_id" in obj)
        return false

    if("title" in obj && typeof obj.title !== "string")
        return false;

    if("img_path" in obj && (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    if("link" in obj && (obj.link !== null && typeof obj.link !== "string"))
        return false;

    if("description" in obj && (obj.description !== null && typeof obj.description !== "string"))
        return false;

    if("start_month" in obj && typeof obj.start_month !== "number")
        return false;

    if("end_month" in obj && typeof obj.end_month !== "number")
        return false;

    if("start_day" in obj && (obj.start_day !== null && typeof obj.start_day !== "number"))
        return false;

    if("end_day" in obj && (obj.end_day !== null && typeof obj.end_day !== "number"))
        return false;

    if("short_description" in obj && (obj.short_description !== null && typeof obj.short_description !== "string"))
        return false;

    return true;
}

export function isPartialEvent(obj: unknown): obj is Partial<Event>{
    if(typeof obj !== "object" || obj === null) return false;

    if("event_id" in obj && typeof obj.event_id !== "number") 
        return false;

    if("title" in obj && typeof obj.title !== "string")
        return false;

    if("img_path" in obj && (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    if("link" in obj && (obj.link !== null && typeof obj.link !== "string"))
        return false;

    if("description" in obj && (obj.description !== null && typeof obj.description !== "string"))
        return false;

    if("start_month" in obj && typeof obj.start_month !== "number")
        return false;

    if("end_month" in obj && typeof obj.end_month !== "number")
        return false;

    if("start_day" in obj && (obj.start_day !== null && typeof obj.start_day !== "number"))
        return false;

    if("end_day" in obj && (obj.end_day !== null && typeof obj.end_day !== "number"))
        return false;

    if("short_description" in obj && (obj.short_description !== null && typeof obj.short_description !== "string"))
        return false;

    return true;
}

export default Event;