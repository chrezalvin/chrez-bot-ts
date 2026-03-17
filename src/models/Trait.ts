import debug from "debug";

const log = debug("app:trait");

export interface Trait {
    trait_id: number;
    name: string;
    description: string;
    extra: string | null;
    img_path: string | null;
}

export function isTrait(obj: unknown): obj is Trait{
    if(typeof obj !== "object" || obj === null) {
        log("object is not defined or null");
        return false;
    }

    if(!("trait_id" in obj)){
        log("property trait_id is not defined");
        return false;
    }

    if(!("name" in obj)){
        log("property name is not defined");
        return false;
    }

    if(!("description" in obj)){
        log("property description is not defined");
        return false;
    }

    if(!("extra" in obj)){
        log("property extra is not defined");
        return false;
    }

    if(!("img_path" in obj)){
        log("property img_path is not defined");
        return false;
    }

    if(typeof obj.trait_id !== "number") {
        log("property trait_id is not a number");
        return false;
    }

    if(typeof obj.name !== "string") {
        log("property name is not a string");
        return false;
    }

    if(typeof obj.description !== "string") {
        log("property description is not a string");
        return false;
    }

    if(typeof obj.extra !== "string" && obj.extra !== null) {
        log("property extra is not a string or null");
        return false;
    }

    if(typeof obj.img_path !== "string" && obj.img_path !== null) {
        log("property img_path is not a string or null");
        return false;
    }

    return true;
}

export function isTraitWithoutId(obj: unknown): obj is Omit<Trait, "trait_id">{
    if(typeof obj !== "object" || obj === null) {
        log("object is not defined or null");
        return false;
    }

    if(!("name" in obj)){
        log("property name is not defined");
        return false;
    }

    if(!("description" in obj)){
        log("property description is not defined");
        return false;
    }

    if(!("extra" in obj)){
        log("property extra is not defined");
        return false;
    }

    if(typeof obj.name !== "string") {
        log("property name is not a string");
        return false;
    }

    if(typeof obj.description !== "string") {
        log("property description is not a string");
        return false;
    }

    if(typeof obj.extra !== "string" && obj.extra !== null) {
        log("property extra is not a string or null");
        return false;
    }

    return true;
}

export function isPartialTrait(obj: unknown): obj is Partial<Trait>{
    if(typeof obj !== "object" || obj === null) {
        log("object is not defined or null");
        return false;
    }

    if("trait_id" in obj && typeof obj.trait_id !== "number") {
        log("property trait_id is not a number");
        return false;
    }

    if("name" in obj && typeof obj.name !== "string") {
        log("property name is not a string");
        return false;
    }

    if("description" in obj && typeof obj.description !== "string") {
        log("property description is not a string");
        return false;
    }

    if("extra" in obj && typeof obj.extra !== "string" && obj.extra !== null) {
        log("property extra is not a string or null");
        return false;
    }

    if("img_path" in obj && typeof obj.img_path !== "string" && obj.img_path !== null) {
        log("property img_path is not a string or null");
        return false;
    }

    return true;
}