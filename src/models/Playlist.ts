const debug = require("debug")("models:Quote");
import { StrictOmit } from "@library/CustomTypes";

export interface Playlist{
    playlist_id: number;
    user: string;
    link_list: string[];
    name: string;
}

export function isPlaylist(value: unknown): value is Playlist {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if(!("playlist_id" in value)){
        debug("property playlist_id is not defined");
        return false;
    }

    if(!("user" in value)){
        debug("property user is not defined");
        return false;
    }

    if(!("link_list" in value)){
        debug("property link_list is not defined");
        return false;
    }

    if(!("name" in value)){
        debug("property name is not defined");
        return false;
    }

    if(typeof value.playlist_id !== "number"){
        debug("property playlist_id is not a number");
        return false;
    }

    if(typeof value.user !== "string"){
        debug("property user is not a string");
        return false;
    }

    if(!Array.isArray(value.link_list)){
        debug("property link_list is not an array");
        return false;
    }

    if(typeof value.name !== "string"){
        debug("property name is not a string");
        return false;
    }

    return true;
}

export function isPlaylistWithoutId(value: unknown): value is StrictOmit<Playlist, "playlist_id"> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("playlist_id" in value){
        debug("property playlist_id is defined");
        return false;
    }

    if("user" in value && typeof value.user !== "string"){
        debug("property user is not a string");
        return false;
    }

    if("link_list" in value && !Array.isArray(value.link_list)){
        debug("property link_list is not an array");
        return false;
    }

    if("name" in value && typeof value.name !== "string"){
        debug("property name is not a string");
        return false;
    }

    return true;
}

export function isPartialPlaylist(value: unknown): value is Partial<Playlist> {
    if(typeof value !== "object" || value === null){
        debug("object is not defined or null");
        return false;
    }

    if("playlist_id" in value && typeof value.playlist_id !== "number"){
        debug("property playlist_id is defined");
        return false;
    }

    if("user" in value && typeof value.user !== "string"){
        debug("property user is not a string");
        return false;
    }

    if("link_list" in value && !Array.isArray(value.link_list)){
        debug("property link_list is not an array");
        return false;
    }


    if("name" in value && typeof value.name !== "string"){
        debug("property name is not a string");
        return false;
    }

    return true;
}