import { SupabaseClient } from "@supabase/supabase-js";
import {v4 as uuidv4} from "uuid";

const debug = require("debug")("Library:FileUpload");

export interface FileUploadContext{
    filename?: string,
    contentType?: string,
    upsert?: boolean,
}

export type FileUploadType = Blob | File | Express.Multer.File | ArrayBuffer | ArrayBufferView<ArrayBufferLike> | Buffer<ArrayBufferLike>;

type BufferChecker = (buffer: ArrayBufferLike) => boolean;
const mimeTypeLookup: Record<string, BufferChecker> = {
    "image/png": (buffer) => {
        const arr = new Uint8Array(buffer);
        // PNG magic numbers: 89 50 4E 47 0D 0A 1A 0A
        const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        if (arr.length < pngSignature.length) return false;
        return pngSignature.every((byte, index) => arr[index] === byte);
    },

    "image/jpeg": (buffer) => {
        const arr = new Uint8Array(buffer);
        // JPEG magic numbers start with: FF D8 FF
        if (arr.length < 3) return false;
        return arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff;
    },

    "image/gif": (buffer) => {
        const arr = new Uint8Array(buffer);
        // GIF magic numbers: "GIF87a" or "GIF89a"
        if (arr.length < 6) return false;
        return (
            arr[0] === 0x47 && // G
            arr[1] === 0x49 && // I
            arr[2] === 0x46 && // F
            arr[3] === 0x38 && // 8
            (arr[4] === 0x37 || arr[4] === 0x39) && // 7 or 9
            arr[5] === 0x61    // a
        );
    },

    "image/webp": (buffer) => {
        const arr = new Uint8Array(buffer);
        // WebP files start with "RIFF" at byte 0-3 and "WEBP" at byte 8-11
        if (arr.length < 12) return false;
        return (
            arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 && // RIFF
            arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50   // WEBP
        );
    },

    // Standard alias for JPEG
    "image/jpg": (buffer) => {
        return mimeTypeLookup["image/jpeg"](buffer);
    },

    // default if nothing works
    "text/txt": () => true,
} as const;

function inferBuffer(file: FileUploadType){
    if("mimetype" in file)
        return file.buffer;

    return file;
}

function inferMimetype(file: FileUploadType){
    if("mimetype" in file)
        return file.mimetype;
    if("type" in file)
        return file.type;

    let buffer: ArrayBufferLike;
    if("buffer" in file)
        buffer = file.buffer;
    else
        buffer = file;

    for (const [mimetype, checker] of Object.entries(mimeTypeLookup))
        if (checker(buffer))
            return mimetype;

    return "text/txt";
}

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
        file: FileUploadType,
        context?: FileUploadContext
    ): Promise<string>
    {
        debug(`Uploading file to storage in bucket: ${this.m_bucketName}`);

        const usedContext: FileUploadContext = {
            filename: context?.filename ?? uuidv4(),
            upsert: context?.upsert ?? true,
            contentType: context?.contentType
        };

        if(!usedContext.contentType)
            usedContext.contentType = inferMimetype(file);

        const buffer = inferBuffer(file);
        const fileExt = usedContext.contentType?.split("/")[1];
        const fileName = usedContext.filename + (fileExt ? `.${fileExt}` : "");

        const res = await this.m_supabaseClient
            .storage
            .from(this.m_bucketName)
            .upload(fileName, buffer, usedContext);

        if (res.error)
            throw new Error(`Error uploading file: ${res.error.message}`);

        return fileName;
    }

    // public async uploadFile(
    //     blob: Blob | File | Express.Multer.File,
    //     // blob: Blob,
    //     filename: string = uuidv4(),
    //     context?: {
    //         contentType: string,
    //         upsert?: boolean,
    //     }
    // ): Promise<string>
    // {
    //     debug(`Uploading file to storage in bucket: ${this.m_bucketName}`);

    //     let fileExt: string = "";
    //     let buffer: Buffer | ArrayBuffer;

    //     if("type" in blob){
    //         fileExt = blob.type.split("/")[1];
    //         buffer = await blob.arrayBuffer();
    //     }
    //     else{
    //         fileExt = blob.mimetype.split("/")[1]
    //         buffer = blob.buffer;
    //     }

    //     // const fileExt = blob.type.split("/")[1];
    //     const fileName = `${filename}.${fileExt}`;

    //     const res = await this.m_supabaseClient
    //         .storage
    //         .from(this.m_bucketName)
    //         .upload(fileName, buffer, {
    //             upsert: true
    //         });

    //     if (res.error)
    //         throw new Error(`Error uploading file: ${res.error.message}`);

    //     return fileName;
    // }

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