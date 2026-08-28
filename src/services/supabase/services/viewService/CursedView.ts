import { FileCache } from "@library/FileCache";
import { supabasePublic } from "@shared/supabase";

const bucket_name = "cursed";
const sfw_cursed_cache = new FileCache(bucket_name, supabasePublic);

export function getCursedUrl(idx?: number){
    return sfw_cursed_cache.getFileUrl(idx);
}

export function getCursedLength(){
    return sfw_cursed_cache.length;
}