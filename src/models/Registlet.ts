const debug = require("debug")("models:Registlet");
import { StrictOmit } from "@library/CustomTypes";

export interface Registlet {
    registlet_id: number;
    name: string;
    description: string;
    max_level: number;
    stoodie_levels: number[];
    img_path: string | null;
};

export function isRegistlet(obj: unknown): obj is Registlet{
    if(typeof obj !== "object" || obj === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("registlet_id" in obj)){
        debug("property registlet_id is not defined");
        return false;
    }

    if(!("name" in obj)){
        debug("property name is not defined");
        return false;
    }

    if(!("description" in obj)){
        debug("property description is not defined");
        return false;
    }

    if(!("max_level" in obj)){
        debug("property max_level is not defined");
        return false;
    }

    if(!("stoodie_levels" in obj)){
        debug("property stoodie_levels is not defined");
        return false;
    }

    if(!("img_path" in obj)){
        debug("property img_path is not defined");
        return false;
    }

    if(typeof obj.registlet_id !== "number"){
        debug("property registlet_id is not a number");
        return false;
    }

    if(typeof obj.name !== "string"){
        debug("property name is not a string");
        return false;
    }

    if(typeof obj.description !== "string"){
        debug("property description is not a string");
        return false;
    }

    if(typeof obj.max_level !== "number"){
        debug("property max_level is not a number");
        return false;
    }

    if(!Array.isArray(obj.stoodie_levels)){
        debug("property stoodie_levels is not an array");
        return false;
    }

    if(obj.img_path !== null && typeof obj.img_path !== "string"){
        debug("property img_path is not a string");
        return false;
    }

    return true;
}

export function isRegistletWithoutId(obj: unknown): obj is StrictOmit<Registlet, "registlet_id">{
    if(typeof obj !== "object" || obj === null){
        debug("object is not defined or null");
        return false;
    }

    if("registlet_id" in obj){
        debug("property registlet_id is defined");
        return false;
    }

    if(!("name" in obj)){
        debug("property name is not defined");
        return false;
    }

    if(!("description" in obj)){
        debug("property description is not defined");
        return false;
    }

    if(!("max_level" in obj)){
        debug("property max_level is not defined");
        return false;
    }

    if(!("stoodie_levels" in obj)){
        debug("property stoodie_levels is not defined");
        return false;
    }

    if(!("img_path" in obj)){
        debug("property img_path is not defined");
        return false;
    }

    if(typeof obj.name !== "string"){
        debug("property name is not a string");
        return false;
    }

    if(typeof obj.description !== "string"){
        debug("property description is not a string");
        return false;
    }

    if(typeof obj.max_level !== "number"){
        debug("property max_level is not a number");
        return false;
    }

    if(!Array.isArray(obj.stoodie_levels)){
        debug("property stoodie_levels is not an array");
        return false;
    }

    if(obj.img_path !== null && typeof obj.img_path !== "string"){
        debug("property img_path is not a string");
        return false;
    }

    return true;
}

export function isPartialRegistlet(obj: unknown): obj is Partial<Registlet>{
    if(typeof obj !== "object" || obj === null){
        debug("object is not defined or null");
        return false;
    }

    if("registlet_id" in obj && typeof obj.registlet_id !== "number"){
        debug("property registlet_id is not a number");
        return false;
    }

    if("name" in obj && typeof obj.name !== "string"){
        debug("property name is not a string");
        return false;
    }

    if("description" in obj && typeof obj.description !== "string"){
        debug("property description is not a string");
        return false;
    }

    if("max_level" in obj && typeof obj.max_level !== "number"){
        debug("property max_level is not a number");
        return false;
    }

    if("stoodie_levels" in obj && !Array.isArray(obj.stoodie_levels)){
        debug("property stoodie_levels is not an array");
        return false;
    }

    if("img_path" in obj && (obj.img_path !== null && typeof obj.img_path !== "string")){
        debug("property img_path is not a string or null");
        return false;
    }

    return true;
}