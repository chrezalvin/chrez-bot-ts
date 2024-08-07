export interface Recommend{
    id: number;
    title: string;
    description: string;
    imgUrl?: string;
    link?: string;
    category?: string[];
}

export function isRecommend(obj: unknown): obj is Recommend{
    if(typeof obj !== "object" || obj === null) return false;
    
    if(!("title" in obj) || !("description" in obj)) return false;
    
    return obj.title !== undefined && obj.description !== undefined;
}
