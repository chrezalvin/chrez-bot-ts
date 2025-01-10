const debug = require("debug")("models:ActiveEvent");
import { StrictOmit } from "@library/CustomTypes";

export interface ActiveEvent{
    active_event_id: number;
    title: string;
    img_path: string | null;
    link: string | null;
    description: string | null;
    start_date: string;
    end_date: string | null;
    short_description: string | null;
}

export function isActiveEvent(obj: unknown): obj is ActiveEvent{
    if(typeof obj !== "object" || obj === null) {
        debug("object is not defined or null");
        return false;
    }

    if(!("active_event_id" in obj)){
        debug("property active_event_id is not defined");
        return false;
    }

    if(!("title" in obj)){
        debug("property title is not defined");
        return false;
    }

    if(!("img_path" in obj)){
        debug("property img_path is not defined");
        return false;
    }

    if(!("link" in obj)){
        debug("property link is not defined");
        return false;
    }

    if(!("description" in obj)){
        debug("property description is not defined");
        return false;
    }

    if(!("start_date" in obj)){
        debug("property start_date is not defined");
        return false;
    }

    if(!("end_date" in obj)){
        debug("property end_date is not defined");
        return false;
    }

    if(!("short_description" in obj)){
        debug("property short_description is not defined");
        return false;
    }

    if(typeof obj.active_event_id !== "number") {
        debug("property active_event_id is not a number");
        return false;
    }

    if(typeof obj.title !== "string"){
        debug("property title is not a string");
        return false;
    }

    if(obj.img_path !== null && typeof obj.img_path !== "string"){
        debug("property img_path is not a string or null");
        return false;
    }

    if(obj.link !== null && typeof obj.link !== "string"){
        debug("property link is not a string or null");
        return false;
    }

    if(obj.description !== null && typeof obj.description !== "string"){
        debug("property description is not a string or null");
        return false;
    }

    if(typeof obj.start_date !== "string"){
        debug("property start_date is not a string");
        return false;
    }

    if(obj.end_date !== null && typeof obj.end_date !== "string"){
        debug("property end_date is not a string or null");
        return false;
    }

    if(obj.short_description !== null && typeof obj.short_description !== "string"){
        debug("property short_description is not a string or null");
        return false;
    }

    return true;
}

export function isActiveEventWithoutId(obj: unknown): obj is StrictOmit<ActiveEvent, "active_event_id">{
    if(typeof obj !== "object" || obj === null) {
        debug("object is not defined or null");
        return false;
    }

    if(!("title" in obj)){
        debug("property title is not defined");
        return false;
    }

    if(!("img_path" in obj)){
        debug("property img_path is not defined");
        return false;
    }

    if(!("link" in obj)){
        debug("property link is not defined");
        return false;
    }

    if(!("description" in obj)){
        debug("property description is not defined");
        return false;
    }

    if(!("start_date" in obj)){
        debug("property start_date is not defined");
        return false;
    }

    if(!("end_date" in obj)){
        debug("property end_date is not defined");
        return false;
    }

    if(!("short_description" in obj)){
        debug("property short_description is not defined");
        return false;
    }

    if(typeof obj.title !== "string"){
        debug("property title is not a string");
        return false;
    }

    if(obj.img_path !== null && typeof obj.img_path !== "string"){
        debug("property img_path is not a string or null");
        return false;
    }

    if(obj.link !== null && typeof obj.link !== "string"){
        debug("property link is not a string or null");
        return false;
    }

    if(obj.description !== null && typeof obj.description !== "string"){
        debug("property description is not a string or null");
        return false;
    }

    if(typeof obj.start_date !== "string"){
        debug("property start_date is not a string");
        return false;
    }

    if(obj.end_date !== null && typeof obj.end_date !== "string"){
        debug("property end_date is not a string or null");
        return false;
    }

    if(obj.short_description !== null && typeof obj.short_description !== "string"){
        debug("property short_description is not a string or null");
        return false;
    }

    return true;
}

export function isPartialActiveEvent(obj: unknown): obj is Partial<ActiveEvent>{
    if(typeof obj !== "object" || obj === null) {
        debug("object is not defined or null");
        return false;
    }

    if("active_event_id" in obj && typeof obj.active_event_id !== "number") {
        debug("property active_event_id is not a number");
        return false;
    }

    if("title" in obj && typeof obj.title !== "string"){
        debug("property title is not a string");
        return false;
    }

    if("img_path" in obj && (obj.img_path !== null && typeof obj.img_path !== "string")){
        debug("property img_path is not a string or null");
        return false;
    }

    if("link" in obj && (obj.link !== null && typeof obj.link !== "string")){
        debug("property link is not a string or null");
        return false;
    }

    if("description" in obj && (obj.description !== null && typeof obj.description !== "string")){
        debug("property description is not a string or null");
        return false;
    }

    if("start_date" in obj && typeof obj.start_date !== "string"){
        debug("property start_date is not a string");
        return false;
    }

    if("end_date" in obj && (obj.end_date !== null && typeof obj.end_date !== "string")){
        debug("property end_date is not a string or null");
        return false;
    }

    if("short_description" in obj && (obj.short_description !== null && typeof obj.short_description !== "string")){
        debug("property short_description is not a string or null");
        return false;
    }

    return true;
}