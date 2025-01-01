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
    if(typeof obj !== "object" || obj === null) return false;

    if(!("registlet_id" in obj) || typeof obj.registlet_id !== "number") 
        return false;

    if(!("name" in obj) || typeof obj.name !== "string")
        return false;

    if(!("description" in obj) || typeof obj.description !== "string")
        return false;

    if(!("max_level" in obj) || typeof obj.max_level !== "number")
        return false;

    if(!("stoodie_levels" in obj) || !Array.isArray(obj.stoodie_levels))
        return false;

    if(!("img_path" in obj) || (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    return true;
}

export function isRegistletWithoutId(obj: unknown): obj is StrictOmit<Registlet, "registlet_id">{
    if(typeof obj !== "object" || obj === null) return false;

    if("registlet_id" in obj)
        return false;

    if("name" in obj && typeof obj.name !== "string")
        return false;

    if("description" in obj && typeof obj.description !== "string")
        return false;

    if("max_level" in obj && typeof obj.max_level !== "number")
        return false;

    if("stoodie_levels" in obj && !Array.isArray(obj.stoodie_levels))
        return false;

    if("img_path" in obj && (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    return true;
}

export function isPartialRegistlet(obj: unknown): obj is Partial<Registlet>{
    if(typeof obj !== "object" || obj === null) return false;

    if("registlet_id" in obj && typeof obj.registlet_id !== "number") 
        return false;

    if("name" in obj && typeof obj.name !== "string")
        return false;

    if("description" in obj && typeof obj.description !== "string")
        return false;

    if("max_level" in obj && typeof obj.max_level !== "number")
        return false;

    if("stoodie_levels" in obj && !Array.isArray(obj.stoodie_levels))
        return false;

    if("img_path" in obj && (obj.img_path !== null && typeof obj.img_path !== "string"))
        return false;

    return true;
}