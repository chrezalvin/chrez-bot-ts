export interface ActiveEvent{
    id: number;
    title: string;
    img_path: string | null;
    link: string | null;
    description: string | null;
    start_date: string;
    end_date: string | null;
    short_description: string | null;
}

export function isActiveEvent(obj: unknown): obj is ActiveEvent{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("id" in obj) || typeof obj.id !== "number") 
        return false;

    if(!("title" in obj) || typeof obj.title !== "string")
        return false;

    if(!("img_path" in obj) || (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    if(!("link" in obj) || (obj.link !== null && typeof obj.link !== "string"))
        return false;

    if(!("description" in obj) || (obj.description !== null && typeof obj.description !== "string"))
        return false;

    if(!("start_date" in obj) || typeof obj.start_date !== "string")
        return false;

    if(!("end_date" in obj) || (obj.end_date !== null && typeof obj.end_date !== "string"))
        return false;

    if(!("short_description" in obj) || (obj.short_description !== null && typeof obj.short_description !== "string"))
        return false;

    return true;
}