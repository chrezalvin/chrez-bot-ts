export interface Update{
    version: string;
    bugfix: string[] | null;
    news: string[] | null;
}

export function isUpdate(value: unknown): value is Update{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("version" in value) || typeof value.version !== "string")
        return false;

    if(!("bugfix" in value) || (!Array.isArray(value.bugfix) && value.bugfix !== null))
        return false;

    if(!("news" in value) || (!Array.isArray(value.news) && value.news !== null))
        return false;

    return true;
}

export function isUpdateWithoutVersion(value: unknown): value is Omit<Update, "version">{
    if(typeof value !== "object" || value === null)
        return false;

    if("version" in value)
        return false;

    if("bugfix" in value && (!Array.isArray(value.bugfix) && value.bugfix !== null))
        return false;

    if("news" in value && (!Array.isArray(value.news) && value.news !== null))
        return false;

    return true;
}

export function isPartialUpdate(value: unknown): value is Partial<Update>{
    if(typeof value !== "object" || value === null)
        return false;

    if("version" in value && typeof value.version !== "string")
        return false;

    if("bugfix" in value && (!Array.isArray(value.bugfix) && value.bugfix !== null))
        return false;

    if("news" in value && (!Array.isArray(value.news) && value.news !== null))
        return false;

    return true;
}