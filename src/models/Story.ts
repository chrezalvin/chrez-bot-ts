export interface Story {
    id: number;
    title: string;
    author: string;
    description: string[];
    footer: string | null;
}

export function isStory(value: unknown): value is Story {
    if(typeof value !== "object" || value === null)
        return false;

    if(!("id" in value) || typeof value.id !== "number")
        return false;

    if(!("title" in value) || typeof value.title !== "string")
        return false;

    if(!("author" in value) || typeof value.author !== "string")
        return false;

    if(!("description" in value) || !Array.isArray(value.description))
        return false;

    if(!("footer" in value) || (typeof value.footer !== "string" && value.footer !== null))
        return false;

    return true;
}

export function isStoryWithoutId(value: unknown): value is Omit<Story, "id"> {
    if(typeof value !== "object" || value === null)
        return false;

    if("id" in value)
        return false;

    if("title" in value && typeof value.title !== "string")
        return false;

    if("author" in value && typeof value.author !== "string")
        return false;

    if("description" in value && !Array.isArray(value.description))
        return false;

    if("footer" in value && (typeof value.footer !== "string" && value.footer !== null))
        return false;

    return true;
}

export function isPartialStory(value: unknown): value is Partial<Story> {
    if(typeof value !== "object" || value === null)
        return false;

    if("title" in value && typeof value.title !== "string")
        return false;

    if("author" in value && typeof value.author !== "string")
        return false;

    if("description" in value && !Array.isArray(value.description))
        return false;

    if("footer" in value && (typeof value.footer !== "string" && value.footer !== null))
        return false;

    return true;
}

export default Story;