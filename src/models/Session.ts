const debug = require("debug")("models:Session");
import { StrictOmit } from "@library/CustomTypes";

export interface Session{
    session_id: string;
    user_id: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export function isSession(value: unknown): value is Session{
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("session_id" in value)){
        debug("property session_id is not defined");
        return false;
    }

    if(!("user_id" in value)){
        debug("property user_id is not defined");
        return false;
    }

    if(!("avatar_url" in value)){
        debug("property avatar_url is not defined");
        return false;
    }

    if(!("created_at" in value)){
        debug("property created_at is not defined");
        return false;
    }

    if(!("updated_at" in value)){
        debug("property updated_at is not defined");
        return false;
    }

    if(typeof value.session_id !== "string"){
        debug("property session_id is not a string");
        return false;
    }

    if(typeof value.user_id !== "string"){
        debug("property user_id is not a string");
        return false;
    }

    if(typeof value.avatar_url !== "string" && value.avatar_url !== null){
        debug("property avatar_url is not a string or null");
        return false;
    }

    if(typeof value.created_at !== "string"){
        debug("property created_at is not a string");
        return false;
    }

    if(typeof value.updated_at !== "string"){
        debug("property updated_at is not a string");
        return false;
    }

    return true;
}

export function isSessionWithoutId(value: unknown): value is StrictOmit<Session, "session_id">{
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("session_id" in value){
        debug("property session_id is defined");
        return false;
    }

    if(!("user_id" in value)){
        debug("property user_id is not defined");
        return false;
    }

    if(!("avatar_url" in value)){
        debug("property avatar_url is not defined");
        return false;
    }

    if(!("created_at" in value)){
        debug("property created_at is not defined");
        return false;
    }

    if(!("updated_at" in value)){
        debug("property updated_at is not defined");
        return false;
    }

    if(typeof value.user_id !== "string"){
        debug("property user_id is not a string");
        return false;
    }

    if(typeof value.avatar_url !== "string" && value.avatar_url !== null){
        debug("property avatar_url is not a string or null");
        return false;
    }

    if(typeof value.created_at !== "string"){
        debug("property created_at is not a string");
        return false;
    }

    if(typeof value.updated_at !== "string"){
        debug("property updated_at is not a string");
        return false;
    }

    return true;
}

export function isPartialSession(value: unknown): value is Partial<Session>{
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("session_id" in value){
        debug("property session_id is defined");
        return false;
    }

    if("user_id" in value && typeof value.user_id !== "string"){
        debug("property user_id is not a string");
        return false;
    }

    if("avatar_url" in value && typeof value.avatar_url !== "string" && value.avatar_url !== null){
        debug("property avatar_url is not a string or null");
        return false;
    }

    if("created_at" in value && typeof value.created_at !== "string"){
        debug("property created_at is not a string");
        return false;
    }

    if("updated_at" in value && typeof value.updated_at !== "string"){
        debug("property updated_at is not a string");
        return false;
    }

    return true;
}