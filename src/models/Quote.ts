export interface Quote{
    id: number;
    author: string;
    description: string[];
    memberRef: string | null;
    nsfw: boolean;
}

export function isQuote(value: unknown): value is Quote {
    if(typeof value !== "object" || value === null)
        return false;

    if(!("id" in value) || typeof value.id !== "number")
        return false;

    if(!("author" in value) || typeof value.author !== "string")
        return false;

    if(!("description" in value) || !Array.isArray(value.description))
        return false;

    if(!("memberRef" in value) || (typeof value.memberRef !== "string" && value.memberRef !== null))
        return false;

    if(!("nsfw" in value) || typeof value.nsfw !== "boolean")
        return false;

    return true;
}

export function isQuoteWithoutId(value: unknown): value is Omit<Quote, "id"> {
    if(typeof value !== "object" || value === null)
        return false;

    if("id" in value)
        return false;

    if("author" in value && typeof value.author !== "string")
        return false;

    if("description" in value && !Array.isArray(value.description))
        return false;

    if("memberRef" in value && (typeof value.memberRef !== "string" && value.memberRef !== null))
        return false;

    if("nsfw" in value && typeof value.nsfw !== "boolean")
        return false;

    return true;
}

export function isPartialQuote(value: unknown): value is Partial<Quote> {
    if(typeof value !== "object" || value === null)
        return false;

    if("id" in value && typeof value.id !== "number")
        return false;

    if("author" in value && typeof value.author !== "string")
        return false;

    if("description" in value && !Array.isArray(value.description))
        return false;

    if("memberRef" in value && (typeof value.memberRef !== "string" && value.memberRef !== null))
        return false;

    if("nsfw" in value && typeof value.nsfw !== "boolean")
        return false;

    return true;
}