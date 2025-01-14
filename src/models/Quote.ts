const debug = require("debug")("models:Quote");
import { StrictOmit } from "@library/CustomTypes";

export interface Quote{
    quote_id: number;
    author: string;
    description: string[];
    memberRef: string | null;
    nsfw: boolean;
}

export function isQuote(value: unknown): value is Quote {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("quote_id" in value)){
        debug("property quote_id is not defined");
        return false;
    }

    if(!("author" in value)){
        debug("property author is not defined");
        return false;
    }

    if(!("description" in value)){
        debug("property description is not defined");
        return false;
    }

    if(!("memberRef" in value)){
        debug("property memberRef is not defined");
        return false;
    }

    if(!("nsfw" in value)){
        debug("property nsfw is not defined");
        return false;
    }

    if(typeof value.quote_id !== "number"){
        debug("property quote_id is not a number");
        return false;
    }

    if(typeof value.author !== "string"){
        debug("property author is not a string");
        return false;
    }

    if(!Array.isArray(value.description)){
        debug("property description is not an array");
        return false;
    }

    if(typeof value.memberRef !== "string" && value.memberRef !== null){
        debug("property memberRef is not a string or null");
        return false;
    }

    if(typeof value.nsfw !== "boolean"){
        debug("property nsfw is not a boolean");
        return false;
    }

    return true;
}

export function isQuoteWithoutId(value: unknown): value is StrictOmit<Quote, "quote_id"> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("author" in value)){
        debug("property author is not defined");
        return false;
    }

    if(!("description" in value)){
        debug("property description is not defined");
        return false;
    }

    if(!("memberRef" in value)){
        debug("property memberRef is not defined");
        return false;
    }

    if(!("nsfw" in value)){
        debug("property nsfw is not defined");
        return false;
    }

    if(typeof value.author !== "string"){
        debug("property author is not a string");
        return false;
    }

    if(!Array.isArray(value.description)){
        debug("property description is not an array");
        return false;
    }

    if(typeof value.memberRef !== "string" && value.memberRef !== null){
        debug("property memberRef is not a string or null");
        return false;
    }

    if(typeof value.nsfw !== "boolean"){
        debug("property nsfw is not a boolean");
        return false;
    }

    return true;
}

export function isPartialQuote(value: unknown): value is Partial<Quote> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("quote_id" in value){
        debug("property quote_id is defined");
        return false;
    }

    if("author" in value && typeof value.author !== "string"){
        debug("property author is not a string");
        return false;
    }

    if("description" in value && !Array.isArray(value.description)){
        debug("property description is not an array");
        return false;
    }

    if("memberRef" in value && typeof value.memberRef !== "string" && value.memberRef !== null){
        debug("property memberRef is not a string or null");
        return false;
    }

    if("nsfw" in value && typeof value.nsfw !== "boolean"){
        debug("property nsfw is not a boolean");
        return false;
    }

    return true;
}