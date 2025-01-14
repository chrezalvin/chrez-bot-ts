const debug = require("debug")("models:Story");
import { StrictOmit } from "@library/CustomTypes";

export interface Story {
    story_id: number;
    title: string;
    author: string;
    description: string[];
    footer: string | null;
}

export function isStory(value: unknown): value is Story {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("story_id" in value)){
        debug("property story_id is not defined");
        return false;
    }

    if(!("title" in value)){
        debug("property title is not defined");
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

    if(!("footer" in value)){
        debug("property footer is not defined");
        return false;
    }

    if(typeof value.story_id !== "number"){
        debug("property story_id is not a number");
        return false;
    }

    if(typeof value.title !== "string"){
        debug("property title is not a string");
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

    if(typeof value.footer !== "string" && value.footer !== null){
        debug("property footer is not a string or null");
        return false;
    }

    return true;
}

export function isStoryWithoutId(value: unknown): value is StrictOmit<Story, "story_id"> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("title" in value)){
        debug("property title is not defined");
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

    if(!("footer" in value)){
        debug("property footer is not defined");
        return false;
    }

    if(typeof value.title !== "string"){
        debug("property title is not a string");
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

    if(typeof value.footer !== "string" && value.footer !== null){
        debug("property footer is not a string or null");
        return false;
    }

    return true;
}

export function isPartialStory(value: unknown): value is Partial<Story> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("story_id" in value){
        debug("property story_id is defined");
        return false;
    }

    if("title" in value && typeof value.title !== "string"){
        debug("property title is not a string");
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

    if("footer" in value && (typeof value.footer !== "string" && value.footer !== null)){
        debug("property footer is not a string or null");
        return false;
    }

    return true;
}

export default Story;