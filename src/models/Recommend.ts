export interface Recommend{
    id: number;
    title: string;
    description: string;
    imgUrl: string | null;
    link: string | null;
    category?: string[];
}

export function isRecommend(obj: unknown): obj is Recommend{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("id" in obj) || typeof obj.id !== "number") 
        return false;

    if(!("title" in obj) || typeof obj.title !== "string")
        return false;

    if(!("description" in obj) || typeof obj.description !== "string")
        return false;

    if(!("imgUrl" in obj) || (obj.imgUrl !== null && typeof obj.imgUrl !== "string"))
        return false;

    if(!("link" in obj) || (obj.link !== null && typeof obj.link !== "string"))
        return false;

    if("category" in obj && !Array.isArray(obj.category)) return false;

    return true;
}

export function isRecommendWithoutId(obj: unknown): obj is Omit<Recommend, "id">{
    if(typeof obj !== "object" || obj === null) return false;
   
    if("id" in obj)
        return false;

    if("title" in obj && typeof obj.title !== "string")
        return false;

    if("description" in obj && typeof obj.description !== "string")
        return false;

    if("imgUrl" in obj && (obj.imgUrl !== null && typeof obj.imgUrl !== "string"))
        return false;

    if("link" in obj && (obj.link !== null && typeof obj.link !== "string"))
        return false;

    if("category" in obj && !Array.isArray(obj.category)) return false;
    
    return true;
}

export function isPartialRecommend(obj: unknown): obj is Partial<Recommend>{
    if(typeof obj !== "object" || obj === null) return false;

    if("id" in obj && typeof obj.id !== "number") return false;

    if("title" in obj && typeof obj.title !== "string") return false;

    if("description" in obj && typeof obj.description !== "string") return false;

    if("imgUrl" in obj && (obj.imgUrl !== null && typeof obj.imgUrl !== "string")) return false;

    if("link" in obj && (obj.link !== null && typeof obj.link !== "string")) return false;

    if("category" in obj && !Array.isArray(obj.category)) return false;

    return true;
}