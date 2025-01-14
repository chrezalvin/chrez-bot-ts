const debug = require("debug")("models:Event");
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
    if(typeof obj !== "object" || obj === null) {
        debug("object is not defined or null");
        return false;
    }

    if(!("event_id" in obj)){
        debug("property event_id is not defined");
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

    if(!("start_month" in obj)){
        debug("property start_month is not defined");
        return false;
    }

    if(!("end_month" in obj)){
        debug("property end_month is not defined");
        return false;
    }

    if(!("start_day" in obj)){
        debug("property start_day is not defined");
        return false;
    }

    if(!("end_day" in obj)){
        debug("property end_day is not defined");
        return false;
    }

    if(!("short_description" in obj)){
        debug("property short_description is not defined");
        return false;
    }

    if(typeof obj.event_id !== "number") {
        debug("property event_id is not a number");
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

    if(typeof obj.start_month !== "number"){
        debug("property start_month is not a number");
        return false;
    }

    if(typeof obj.end_month !== "number"){
        debug("property end_month is not a number");
        return false;
    }

    if(obj.start_day !== null && typeof obj.start_day !== "number"){
        debug("property start_day is not a number or null");
        return false;
    }

    if(obj.end_day !== null && typeof obj.end_day !== "number"){
        debug("property end_day is not a number or null");
        return false;
    }

    if(obj.short_description !== null && typeof obj.short_description !== "string"){
        debug("property short_description is not a string or null");
        return false;
    }

    return true;
}

export function isEventWithoutId(obj: unknown): obj is StrictOmit<Event, "event_id" | "img_path">{
    if(typeof obj !== "object" || obj === null) {
        debug("object is not defined or null");
        return false;
    }

    if(!("title" in obj)){
        debug("property title is not defined");
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

    if(!("start_month" in obj)){
        debug("property start_month is not defined");
        return false;
    }

    if(!("end_month" in obj)){
        debug("property end_month is not defined");
        return false;
    }

    if(!("start_day" in obj)){
        debug("property start_day is not defined");
        return false;
    }

    if(!("end_day" in obj)){
        debug("property end_day is not defined");
        return false;
    }

    if(!("short_description" in obj)){
        debug("property short_description is not defined");
        return false;
    }

    if(obj.title !== null && typeof obj.title !== "string"){
        debug("property title is not a string or null");
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

    if(typeof obj.start_month !== "number"){
        debug("property start_month is not a number");
        return false;
    }

    if(typeof obj.end_month !== "number"){
        debug("property end_month is not a number");
        return false;
    }

    if(obj.start_day !== null && typeof obj.start_day !== "number"){
        debug("property start_day is not a number or null");
        return false;
    }

    if(obj.end_day !== null && typeof obj.end_day !== "number"){
        debug("property end_day is not a number or null");
        return false;
    }

    if(obj.short_description !== null && typeof obj.short_description !== "string"){
        debug("property short_description is not a string or null");
        return false;
    }

    return true;
}

export function isPartialEvent(obj: unknown): obj is Partial<Event>{
    if(typeof obj !== "object" || obj === null) {
        debug("object is not defined or null");
        return false;
    }

    if("event_id" in obj){
        debug("property event_id is defined");
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

    if("start_month" in obj && typeof obj.start_month !== "number"){
        debug("property start_month is not a number");
        return false;
    }

    if("end_month" in obj && typeof obj.end_month !== "number"){
        debug("property end_month is not a number");
        return false;
    }

    if("start_day" in obj && (obj.start_day !== null && typeof obj.start_day !== "number")){
        debug("property start_day is not a number or null");
        return false;
    }

    if("end_day" in obj && (obj.end_day !== null && typeof obj.end_day !== "number")){
        debug("property end_day is not a number or null");
        return false;
    }

    if("short_description" in obj && (obj.short_description !== null && typeof obj.short_description !== "string")){
        debug("property short_description is not a string or null");
        return false;
    }

    return true;
}

export default Event;