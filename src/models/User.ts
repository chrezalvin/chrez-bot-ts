const debug = require("debug")("models:User");
import { StrictOmit } from "@library/CustomTypes";

export type RoleName = "owner" | "vice" | "admin" | "user";

export interface User{
    user_id: string;
    username: string;
    timezone: string | null;
    aliases: string[] | null;
    role: RoleName;
    birthday: string | null;
}

export function isUser(value: unknown): value is User{
    if(value === null || typeof value !== "object"){
        debug("object is not defined or null");
        return false;
    }

    if(!("user_id" in value)){
        debug("property user_id is not defined");
        return false;
    }

    if(!("username" in value)){
        debug("property username is not defined");
        return false;
    }

    if(!("timezone" in value)){
        debug("property timezone is not defined");
        return false;
    }

    if(!("aliases" in value)){
        debug("property aliases is not defined");
        return false;
    }

    if(!("role" in value)){
        debug("property role is not defined");
        return false;
    }

    if(!("birthday" in value)){
        debug("property birthday is not defined");
        return false;
    }

    if(typeof value.user_id !== "string"){
        debug("property user_id is not a string");
        return false;
    }

    if(typeof value.username !== "string"){
        debug("property username is not a string");
        return false;
    }

    if(typeof value.timezone !== "string" && value.timezone !== null){
        debug("property timezone is not a string or null");
        return false;
    }

    if(!Array.isArray(value.aliases) && value.aliases !== null){
        debug("property aliases is not an array or null");
        return false;
    }

    if(typeof value.role !== "string" || !["owner", "vice", "admin", "user"].includes(value.role)){
        debug("property role is not a string or not one of the predefined values");
        return false;
    }

    if(typeof value.birthday !== "string" && value.birthday !== null){
        debug("property birthday is not a string or null");
        return false;
    }

    return true;
}

export function isUserWithoutId(value: unknown): value is StrictOmit<User, "user_id">{
    if(value === null || typeof value !== "object"){
        debug("object is not defined or null");
        return false;
    }

    if(!("username" in value)){
        debug("property username is not defined");
        return false;
    }

    if(!("timezone" in value)){
        debug("property timezone is not defined");
        return false;
    }

    if(!("aliases" in value)){
        debug("property aliases is not defined");
        return false;
    }

    if(!("role" in value)){
        debug("property role is not defined");
        return false;
    }

    if(!("birthday" in value)){
        debug("property birthday is not defined");
        return false;
    }

    if(typeof value.username !== "string"){
        debug("property username is not a string");
        return false;
    }

    if(typeof value.timezone !== "string" && value.timezone !== null){
        debug("property timezone is not a string or null");
        return false;
    }

    if(!Array.isArray(value.aliases) && value.aliases !== null){
        debug("property aliases is not an array or null");
        return false;
    }

    if(typeof value.role !== "string" || !["owner", "vice", "admin", "user"].includes(value.role)){
        debug("property role is not a string or not one of the predefined values");
        return false;
    }

    if(typeof value.birthday !== "string" && value.birthday !== null){
        debug("property birthday is not a string or null");
        return false;
    }

    return true;
}

export function isPartialUser(value: unknown): value is Partial<User>{
    if(value === null || typeof value !== "object"){
        debug("object is not defined or null");
        return false;
    }

    if("user_id" in value){
        debug("property user_id is defined");
        return false;
    }

    if("username" in value && typeof value.username !== "string"){
        debug("property username is not a string");
        return false;
    }

    if("timezone" in value && (typeof value.timezone !== "string" && value.timezone !== null)){
        debug("property timezone is not a string or null");
        return false;
    }

    if("aliases" in value && (!Array.isArray(value.aliases) && value.aliases !== null)){
        debug("property aliases is not an array or null");
        return false;
    }

    if("role" in value && (typeof value.role !== "string" || !["owner", "vice", "admin", "user"].includes(value.role))){
        debug("property role is not a string or not one of the predefined values");
        return false;
    }

    if("birthday" in value && (typeof value.birthday !== "string" && value.birthday !== null)){
        debug("property birthday is not a string or null");
        return false;
    }

    return true;
}