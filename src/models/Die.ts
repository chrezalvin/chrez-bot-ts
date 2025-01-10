const debug = require("debug")("models:Die");
import { StrictOmit } from "@library/CustomTypes";

export interface Die{
    die_id: number;
    message: string;
    role: number;
}

export function isDie(value: unknown): value is Die {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("die_id" in value)){
        debug("property die_id is not defined");
        return false;
    }

    if(!("message" in value)){
        debug("property message is not defined");
        return false;
    }

    if(!("role" in value)){
        debug("property role is not defined");
        return false;
    }

    if(typeof value.die_id !== "number"){
        debug("property die_id is not a number");
        return false;
    }

    if(typeof value.message !== "string"){
        debug("property message is not a string");
        return false;
    }

    if(typeof value.role !== "number"){
        debug("property role is not a number");
        return false;
    }

    return true;
}

export function isDieWithoutId(value: unknown): value is StrictOmit<Die, "die_id"> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("message" in value)){
        debug("property message is not defined");
        return false;
    }

    if(!("role" in value)){
        debug("property role is not defined");
        return false;
    }

    if(typeof value.message !== "string"){
        debug("property message is not a string");
        return false;
    }

    if(typeof value.role !== "number"){
        debug("property role is not a number");
        return false;
    }

    return true;
}

export function isPartialDie(value: unknown): value is Partial<Die> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("die_id" in value && typeof value.die_id !== "number"){
        debug("property die_id is not a number");
        return false;
    }

    if("message" in value && typeof value.message !== "string"){
        debug("property message is not a string");
        return false;
    }

    if("role" in value && typeof value.role !== "number"){
        debug("property role is not a number");
        return false;
    }

    return true;
}

export default Die;