const debug = require("debug")("app:FileManager");

import { firebaseApp } from "@config";
import { getStorage, UploadResult, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";

export class FileManager{
    protected static readonly acceptedBlobTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    protected static storage = getStorage(firebaseApp);

    protected m_imgPath: string;

    constructor(imgPath: string){
        this.m_imgPath = imgPath;
    }

    // private async base functions to only get data from database
    /**
     * Uploads an image to the database, this function will only accept the extension that is in the acceptedBlobTypes
     * @param imgUrl url of the image to be uploaded
     * @param filename the file name of the image that will be stored in the database (without extension)
     * @returns UploadResult
     */
    protected async _uploadImage(imgUrl: string, filename: string): Promise<UploadResult>{
        // fetcha and test if the data is a valid image
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        
        if(!FileManager.acceptedBlobTypes.includes(blob.type))
            throw new Error("Invalid image file!");

        const fileExtension = blob.type.split("/")[1];
        const imgRef = ref(FileManager.storage, `${this.m_imgPath}/${filename}.${fileExtension}`);
        const uploadRes = await uploadBytes(imgRef, blob);

        return uploadRes;
    }

    /**
     * deletes an image in the firebase storage
     * @param imgName the name of the image to be deleted
     */
    protected async _deleteImage(imgName: string): Promise<void>{
        const storageRef = ref(FileManager.storage, `${this.m_imgPath}/${imgName}`);
        await deleteObject(storageRef);
    }

    /**
     * replaces the image in the database with a new image without changing the filename in the database
     * @param imgUrl the new image url
     * @param filename the filename of the image
     * @returns UploadResult
     */
    protected async _replaceImage(imgUrl: string, filename: string): Promise<UploadResult>{
        await this._deleteImage(filename);
        return await this._uploadImage(imgUrl, filename);
    }

    /**
     * get the download url of an image from the path
     * @param path the path of the image
     * @returns the download url of the image
     */
    protected async _getUrlFromPath(path: string): Promise<string>{
        const imgRef = ref(FileManager.storage, path);
        const imgUrl = await getDownloadURL(imgRef);
        return imgUrl;
    }

    // public accessible functions that wraps the base functions
    public async uploadImage(imgUrl: string, filename: string): Promise<UploadResult | null>{
        debug(`Uploading ${filename}`);
        
        const res = await this._uploadImage(imgUrl, filename);
        return res;
    }

    public async deleteImage(imgName: string): Promise<void>{
        debug(`Deleting ${imgName}`);

        await this._deleteImage(imgName);
    }

    public async replaceImage(imgUrl: string, filename: string): Promise<UploadResult>{
        debug(`Replacing ${filename}`);

        return await this._replaceImage(imgUrl, filename);
    }

    public async getUrlFromPath(path: string): Promise<string>{
        debug(`Getting url from ${path}`);

        return await this._getUrlFromPath(path);
    }
}