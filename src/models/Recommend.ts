import { StrictOmit } from "@library/CustomTypes";

export interface Recommend{
    recommend_id: number;
    title: string;
    description: string;
    imgUrl: string | null;
    link: string | null;
    category?: string[];
}

export function isRecommend(obj: unknown): obj is Recommend{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("recommend_id" in obj) || typeof obj.recommend_id !== "number") 
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

export function isRecommendWithoutId(obj: unknown): obj is StrictOmit<Recommend, "recommend_id">{
    if(typeof obj !== "object" || obj === null) return false;
   
    if("recommend_id" in obj)
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

    if("recommend_id" in obj && typeof obj.recommend_id !== "number") return false;

    if("title" in obj && typeof obj.title !== "string") return false;

    if("description" in obj && typeof obj.description !== "string") return false;

    if("imgUrl" in obj && (obj.imgUrl !== null && typeof obj.imgUrl !== "string")) return false;

    if("link" in obj && (obj.link !== null && typeof obj.link !== "string")) return false;

    if("category" in obj && !Array.isArray(obj.category)) return false;

    return true;
}