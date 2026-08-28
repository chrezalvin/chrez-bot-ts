import { FileCache } from "@library/FileCache";
import { supabasePublic } from "@shared/supabase";

const bucket_name = "memes";
const sfw_memes_cache = new FileCache("sfw_memes", supabasePublic);
const nsfw_memes_cache = new FileCache("nsfw_memes", supabasePublic);

export function getMemeUrl(nsfw: boolean, idx?: number){
    return (nsfw ? nsfw_memes_cache : sfw_memes_cache).getFileUrl(idx);
}

export function getMemeLength(nsfw: boolean){
    return (nsfw ? nsfw_memes_cache : sfw_memes_cache).length;
}