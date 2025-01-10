const debug = require("debug")("models:Update");
import { StrictOmit } from "@library/CustomTypes";

export interface Update{
    version: string;
    bugfix: string[] | null;
    news: string[] | null;
}

export function isUpdate(value: unknown): value is Update{
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("version" in value)){
        debug("property version is not defined");
        return false;
    }

    if(!("bugfix" in value)){
        debug("property bugfix is not defined");
        return false;
    }

    if(!("news" in value)){
        debug("property news is not defined");
        return false;
    }

    if(typeof value.version !== "string"){
        debug("property version is not a string");
        return false;
    }

    if(!Array.isArray(value.bugfix) && value.bugfix !== null){
        debug("property bugfix is not an array or null");
        return false;
    }

    if(!Array.isArray(value.news) && value.news !== null){
        debug("property news is not an array or null");
        return false;
    }

    return true;
}

export function isUpdateWithoutVersion(value: unknown): value is StrictOmit<Update, "version">{
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("bugfix" in value)){
        debug("property bugfix is not defined");
        return false;
    }

    if(!("news" in value)){
        debug("property news is not defined");
        return false;
    }

    if(!Array.isArray(value.bugfix) && value.bugfix !== null){
        debug("property bugfix is not an array or null");
        return false;
    }

    if(!Array.isArray(value.news) && value.news !== null){
        debug("property news is not an array or null");
        return false;
    }

    return true;
}

export function isPartialUpdate(value: unknown): value is Partial<Update>{
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("version" in value && typeof value.version !== "string"){
        debug("property version is not a string");
        return false;
    }

    if("bugfix" in value && (!Array.isArray(value.bugfix) && value.bugfix !== null)){
        debug("property bugfix is not an array or null");
        return false;
    }

    if("news" in value && (!Array.isArray(value.news) && value.news !== null)){
        debug("property news is not an array or null");
        return false;
    }

    return true;
}