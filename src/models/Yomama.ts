export interface Yomama{
    id: number;
    message: string;
}

export function isYomama(value: unknown): value is Yomama {
    if(typeof value !== "object" || value === null)
        return false;

    if(!("id" in value) || typeof value.id !== "number")
        return false;

    if(!("message" in value) || typeof value.message !== "string")
        return false;

    return true;
}

export default Yomama;