import { StrictOmit } from "@library/CustomTypes";

export interface Yomama{
    yomama_id: number;
    message: string;
}

export function isYomama(value: unknown): value is Yomama {
    if(typeof value !== "object" || value === null)
        return false;

    if(!("yomama_id" in value) || typeof value.yomama_id !== "number")
        return false;

    if(!("message" in value) || typeof value.message !== "string")
        return false;

    return true;
}

export function isYomamaWithoutId(value: unknown): value is StrictOmit<Yomama, "yomama_id"> {
    if(typeof value !== "object" || value === null)
        return false;

    if("message" in value && typeof value.message !== "string")
        return false;

    return true;
}

export function isPartialYomama(value: unknown): value is Partial<Yomama> {
    if(typeof value !== "object" || value === null)
        return false;

    if("yomama_id" in value && typeof value.yomama_id !== "number")
        return false;

    if("message" in value && typeof value.message !== "string")
        return false;

    return true;
}

export default Yomama;