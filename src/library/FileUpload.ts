import { SupabaseClient } from "@supabase/supabase-js";
import {v4 as uuidv4} from "uuid";

const debug = require("debug")("Library:FileUpload");

export class FileUpload{
    protected m_bucketName: string;
    protected m_maxFileSize: number;
    protected m_supabaseClient: SupabaseClient;

    constructor(
        bucketName: string,
        supabaseClient: SupabaseClient<any, any, any>,
        maxFileSizeMB: number = 4
    ){
        this.m_bucketName = bucketName;
        this.m_supabaseClient = supabaseClient;
        this.m_maxFileSize = maxFileSizeMB * 1024 * 1024;
    }

    public async uploadFile(
        blob: Blob,
        filename: string = uuidv4(),
    ): Promise<string>
    {
        debug(`Uploading file to storage in bucket: ${this.m_bucketName}`);

        const fileExt = blob.type.split("/")[1];
        const fileName = `${filename}.${fileExt}`;

        const res = await this.m_supabaseClient
            .storage
            .from(this.m_bucketName)
            .upload(fileName, blob, {
                upsert: true
            });

        if (res.error)
            throw new Error(`Error uploading file: ${res.error.message}`);

        return fileName;
    }

    public async removeFile(filename: string): Promise<true>
    {
        debug(`Removing file from storage in bucket: ${this.m_bucketName} with filename: ${filename}`);

        const { error } = await this.m_supabaseClient
            .storage
            .from(this.m_bucketName)
            .remove([filename]);

        if (error)
            throw new Error(`Error removing file from storage: ${error.message}`);

        return true;
    }

    public translatePathToUrl(img_path: string): string{
        return this.m_supabaseClient
            .storage
            .from(this.m_bucketName)
            .getPublicUrl(img_path)
            .data
            .publicUrl;
    }
}