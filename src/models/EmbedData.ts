import { EmbedData } from "discord.js";

export function isEmbedData(data: unknown): data is EmbedData{
    if(typeof data !== "object" || data === null)
        return false;

    if("title" in data && typeof data.title !== "string")
        return false;

    if("description" in data && typeof data.description !== "string")
        return false;

    if("color" in data && typeof data.color !== "number")
        return false;
    
    if("url" in data && typeof data.url !== "string")
        return false;

    if("thumbnail" in data){
        if(typeof data.thumbnail !== "object" || data.thumbnail === null)
            return false;

        if(!("url" in data.thumbnail) || typeof data.thumbnail.url !== "string")
            return false;

        if("width" in data.thumbnail && typeof data.thumbnail.width !== "number")
            return false;

        if("height" in data.thumbnail && typeof data.thumbnail.height !== "number")
            return false;

        if("proxyUrl" in data.thumbnail && typeof data.thumbnail.proxyUrl !== "string")
            return false;        
    }

    if("image" in data){
        if(typeof data.image !== "object" || data.image === null)
            return false;

        if(!("url" in data.image) || typeof data.image.url !== "string")
            return false;

        if("width" in data.image && typeof data.image.width !== "number")
            return false;

        if("height" in data.image && typeof data.image.height !== "number")
            return false;

        if("proxyUrl" in data.image && typeof data.image.proxyUrl !== "string")
            return false;
    }
    
    if("author" in data){
        if(typeof data.author !== "object" || data.author === null)
            return false;

        if(!("name" in data.author) || typeof data.author.name !== "string")
            return false;

        if("url" in data.author && typeof data.author.url !== "string")
            return false;

        if("iconUrl" in data.author && typeof data.author.iconUrl !== "string")
            return false;

        if("proxyIconUrl" in data.author && typeof data.author.proxyIconUrl !== "string")
            return false;
    }

    if("fields" in data){
        if(!Array.isArray(data.fields))
            return false;

        for(const field of data.fields){
            if(typeof field !== "object" || field === null)
                return false;

            if(!("name" in field) || typeof field.name !== "string")
                return false;

            if(!("value" in field) || typeof field.value !== "string")
                return false;

            if("inline" in field && typeof field.inline !== "boolean")
                return false;
        }
    }

    if("footer" in data){
        if(typeof data.footer !== "object" || data.footer === null)
            return false;

        if(!("text" in data.footer) || typeof data.footer.text !== "string")
            return false;

        if("iconUrl" in data.footer && typeof data.footer.iconUrl !== "string")
            return false;

        if("proxyIconUrl" in data.footer && typeof data.footer.proxyIconUrl !== "string")
            return false;
    }

    return true;
}