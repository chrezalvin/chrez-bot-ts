const debug = require("debug")("models:Yomama");
import { StrictOmit } from "@library/CustomTypes";

export interface Yomama{
    yomama_id: number;
    message: string;
}

export function isYomama(value: unknown): value is Yomama {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("yomama_id" in value)){
        debug("property yomama_id is not defined");
        return false;
    }

    if(!("message" in value)){
        debug("property message is not defined");
        return false;
    }

    if(typeof value.yomama_id !== "number"){
        debug("property yomama_id is not a number");
        return false;
    }

    if(typeof value.message !== "string"){
        debug("property message is not a string");
        return false;
    }

    return true;
}

export function isYomamaWithoutId(value: unknown): value is StrictOmit<Yomama, "yomama_id"> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("message" in value)){
        debug("property message is not defined");
        return false;
    }

    return true;
}

export function isPartialYomama(value: unknown): value is Partial<Yomama> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("yomama_id" in value && typeof value.yomama_id !== "number"){
        debug("property yomama_id is not a number");   
        return false;
    }

    if("message" in value && typeof value.message !== "string"){
        debug("property message is not a string");
        return false;
    }

    return true;
}

export default Yomama;