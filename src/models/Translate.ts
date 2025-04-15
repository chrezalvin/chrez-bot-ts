import { StrictOmit } from "@library/CustomTypes";

export type Conotation = "positive" | "negative" | "neutral";

export interface Translate{
    id: number;
    name: string[];
    explanations: string[];
    conotation: Conotation;
}

export function isTranslate(obj: unknown): obj is Translate{
    if(typeof obj !== "object" || obj === null)
        return false;

    if(!("id" in obj))
        return false;

    if(!("name" in obj))
        return false;

    if(!("explanations" in obj))
        return false;

    if(!("conotation" in obj))
        return false;

    if(typeof obj.id !== "number")
        return false;

    if(!Array.isArray(obj.name))
        return false;

    if(!Array.isArray(obj.explanations))
        return false;

    if(typeof obj.conotation !== "string" || !["positive", "negative", "neutral"].includes(obj.conotation))
        return false;

    return true;
}

export function isTranslateWithoutId(obj: unknown): obj is Translate{
    if(typeof obj !== "object" || obj === null)
        return false;

    if(!("name" in obj))
        return false;

    if(!("explanations" in obj))
        return false;

    if(!("conotation" in obj))
        return false;

    if(!Array.isArray(obj.name))
        return false;

    if(!Array.isArray(obj.explanations))
        return false;

    if(typeof obj.conotation !== "string" || !["positive", "negative", "neutral"].includes(obj.conotation))
        return false;

    return true;
}

export function isPartialTranslate(value: unknown): value is StrictOmit<Translate, "id"> {
    if(typeof value !== "object" || value === null)
        return false;

    if(!("name" in value))
        return false;

    if(!("explanations" in value))
        return false;

    if(!("conotation" in value))
        return false;

    if(!Array.isArray(value.name))
        return false;

    if(!Array.isArray(value.explanations))
        return false;

    if(typeof value.conotation !== "string" || !["positive", "negative", "neutral"].includes(value.conotation))
        return false;

    return true;
}