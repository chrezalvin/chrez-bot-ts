import { SupabaseClient } from "@supabase/supabase-js";
import { rngInt } from "./BasicFunctions";

const debug = require("debug")("Library:FileCache");

export class FileCache{
    protected m_bucketName: string;
    protected m_supabaseClient: SupabaseClient;
    protected m_cache: string[] = [];

    constructor(
        bucketName: string,
        supabaseClient: SupabaseClient<any, any, any>,
    ){
        this.m_bucketName = bucketName;
        this.m_supabaseClient = supabaseClient;

        this.getAllFiles();
    }

    private async getAllFiles(){
        const {data, error} = await this.m_supabaseClient
            .storage
            .from(this.m_bucketName)
            .list(undefined, {
                limit: 1000
            });

        if(error)
            debug(`error fetching from ${this.m_bucketName}`);

        if(data){
            this.m_cache = data.map(e => e.name);
            debug(`fetched ${data.length} files from ${this.m_bucketName}`);
        }
    }

    private translatePathToUrl(img_name: string): string{
        return this.m_supabaseClient
            .storage
            .from(this.m_bucketName)
            .getPublicUrl(img_name)
            .data
            .publicUrl;
    }

    public getFileUrl(idx: number = rngInt(0, this.m_cache.length - 1)){
        return {
            index: idx,
            url: this.translatePathToUrl(this.m_cache[idx])
        };
    }

    get length(){
        return this.m_cache.length;
    }
}