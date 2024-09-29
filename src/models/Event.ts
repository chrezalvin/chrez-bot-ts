export interface Event{
    id: number;
    title: string;
    imgUrl: string | null;
    description: string | null;
    start_date: string;
    end_date: string;
}

export function isEvent(obj: unknown): obj is Event{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("id" in obj) || typeof obj.id !== "number") 
        return false;

    if(!("title" in obj) || typeof obj.title !== "string")
        return false;

    if(!("imgUrl" in obj) || (typeof obj.imgUrl !== "string" && obj.imgUrl !== null))
        return false;

    if(!("description" in obj) || (typeof obj.description !== "string" && obj.description !== null))
        return false;

    if(!("start_date" in obj) || typeof obj.start_date !== "string")
        return false;

    if(!("end_date" in obj) || typeof obj.end_date !== "string")
        return false;

    return true;
}

export default Event;