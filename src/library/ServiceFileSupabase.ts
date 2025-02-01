const debug = require("debug")("library:ServiceFileSupabase");

import { randomUUID } from "crypto";
import { inferType } from "./InferType";
import { StrictOmit } from "./CustomTypes";
import { SupabaseClient } from "@supabase/supabase-js";

type PostgrestFilterBuilder = ReturnType<ReturnType<SupabaseClient["from"]>["select"]>;
type PostgrestBuilder = ReturnType<ReturnType<ReturnType<SupabaseClient["from"]>["select"]>["single"]>;

export class ServiceFileSupabase<
    DataType extends Object,
    IdKey extends Extract<keyof DataType, string>,
    OmittedKey extends Extract<keyof DataType, string> = never,
    FileKey extends keyof DataType = never,
>{
    public static s_services: ServiceFileSupabase<any, any, any, any>[] = [];

    private m_supabase: SupabaseClient;

    protected m_useCache: boolean;
    protected m_cache: Map<DataType[IdKey], DataType> = new Map();

    // table
    protected m_keyName: IdKey;
    protected m_tableName: string;
    protected m_typeGuard?: (value: unknown) => value is DataType;
    
    // storage
    protected m_storageBucket: string = "";
    protected m_storagePath: string = "";
    protected m_fileKeyName: FileKey | null = null;

    // getter
    // table
    get tableName(): string { return this.m_tableName; }
    get keyName(): IdKey { return this.m_keyName; }

    // storage
    get fileKeyName(): FileKey | null { return this.m_fileKeyName; }
    get storagePath(): string { return this.m_storagePath; }

    get cache(): DataType[]{
        return [...this.m_cache.values()];
    }

    get useCache(): boolean{ return this.m_useCache; }

    public translateFileToUrl(data: DataType): DataType {
        debug(`translating file to url for data with ${this.m_keyName}: ${data[this.m_keyName]}`);

        if(!this.m_fileKeyName){
            debug(`no file key name found, returning data as is`);
            return data;
        }

        const filePath = data[this.m_fileKeyName] as string;

        const downloadUrl = this.m_supabase
            .storage
            .from(this.m_storageBucket)
            .getPublicUrl(filePath)
            .data
            .publicUrl;

        debug(`download url: ${downloadUrl}`);

        return {
            ...data,
            [this.m_fileKeyName]: downloadUrl,
        };
    }

    private async getAllDataDebugless(): Promise<DataType[]>{
        const response = await this.m_supabase
            .from(this.m_tableName)
            .select("*");

        if(response.error)
            throw new Error(response.error.message);

        const data = response.data as unknown[];

        if(this.m_typeGuard)
            if(data.every(value => this.m_typeGuard!(value)))
                return data;
            else {
                debug(`failed to typeguard the data, data type is:\n${inferType(data)}`);
                throw new Error("Typeguard failed");
            }
        else
            return response.data as DataType[];
    }

    constructor(
        supabaseClient: SupabaseClient,
        keyName: IdKey,
        tableOption: {
            tableName: string,
            useCache?: boolean,
            typeGuard?: (value: unknown) => value is DataType,
        },
        ...storageOption: ([FileKey] extends [never] ? [] : [{
            bucketName: string,
            storagePath: string,
            fileKey: FileKey & DataType[FileKey] extends string ? FileKey : never,
        }])
    ){
        this.m_supabase = supabaseClient;

        // table
        this.m_keyName = keyName;

        this.m_tableName = tableOption.tableName;
        this.m_typeGuard = tableOption.typeGuard;
        this.m_useCache = tableOption.useCache ?? true;
        
        // storage
        this.m_storageBucket = storageOption[0]?.bucketName.replace(/\/$/, "") ?? "";
        this.m_fileKeyName = storageOption[0]?.fileKey ?? null;
        this.m_storagePath = storageOption[0]?.storagePath ?? "";

        // updates the cache
        if(this.m_useCache)
            this.getAllDataDebugless()
                .then((data) => {
                    for(const ele of data){
                        if(this.m_fileKeyName){
                            const downloadUrl = this.m_supabase
                                .storage
                                .from(this.m_storageBucket)
                                .getPublicUrl(ele[this.m_fileKeyName] as string)
                                .data
                                .publicUrl;

                            ele[this.m_fileKeyName] = downloadUrl as DataType[FileKey];
                        }

                        this.m_cache.set(ele[this.m_keyName], ele);
                    }

                    debug(`successfully cached ${data.length} data from ${this.m_tableName}`)
                })
                .catch((e) => debug(`failed to load all data from ${this.m_tableName}, error: ${e.message}`));

        // add to the services
        ServiceFileSupabase.s_services.push(this);
    }

    // these are private methods that returns non-translated data
    private async _get(key: DataType[IdKey]): Promise<DataType>{
        debug(`getting ${this.m_tableName} data with key: ${key}`);

        const response = await this.m_supabase
            .from(this.m_tableName)
            .select("*")
            .eq(this.m_keyName, key)
            .single();
        
        if(response.error)
            throw new Error(response.error.message);

        const data = response.data as unknown;

        debug(`data: ${JSON.stringify(data)}`);

        if(this.m_typeGuard)
            if(this.m_typeGuard(data))
                return data as DataType;
            else {
                debug(`failed to typeguard the data, data type is:\n${inferType(data)}`);
                throw new Error("Typeguard failed");
            }
        else
            return data as DataType;
    }

    private async _getAll(): Promise<DataType[]>{
        debug(`getting all data`);

        const response = await this.m_supabase
            .from(this.m_tableName)
            .select("*");

        if(response.error)
            throw new Error(response.error.message);

        const data = response.data as unknown[];

        debug(`data: ${JSON.stringify(data)}`);

        if(this.m_typeGuard)
            if(data.every(this.m_typeGuard))
                return data;
            else {
                debug(`failed to typeguard the data, data type is:\n${inferType(data)}`);
                throw new Error("Typeguard failed");
            }
        else 
            return data as DataType[];
    }

    private async _delete(key: DataType[IdKey]): Promise<void>{
        debug(`deleting data with key: ${key}`);

        if(this.m_fileKeyName){
            const data = await this._get(key);

            if(data[this.m_fileKeyName]){
                const fileName = data[this.m_fileKeyName] as string;

                if(!fileName)
                    throw new Error("Failed to get image name");

                await this.m_supabase
                    .storage
                    .from(this.m_storageBucket)
                    .remove([fileName]);
            }
        }

        const response = await this.m_supabase
            .from(this.m_tableName)
            .delete()
            .eq(this.m_keyName, key);

        if(response.error)
            throw new Error(response.error.message);

        if(this.m_useCache)
            this.m_cache.delete(key);
    }

    async _add(
        data: StrictOmit<DataType, IdKey | OmittedKey | FileKey>, 
        ...fileOption: ([FileKey] extends [never] ? 
            [] 
            : 
            null extends DataType[FileKey] ? 
                [] | [{file: Blob | null, fileName?: string}] 
                :
                [{file: Blob, fileName?: string}]
        )
    ): Promise<DataType>{
        debug(`adding new data`);

        let filePath: string | null | undefined = undefined;
        if(this.m_fileKeyName && fileOption.length > 0){
            debug(`file option and key name found, uploading file`);
            debug(`option: ${JSON.stringify(fileOption)}`);

            const file = fileOption[0]?.file;
            const fileName = fileOption[0]?.fileName;

            if(file === null)
                filePath = null;
            else{
                if(!file)
                    throw new Error("File is missing");
    
                const uploadedFileName = fileName ?? randomUUID();
                const fileExtension = file.type.split("/")[1];
    
                const response = await this.m_supabase
                    .storage
                    .from(this.m_storageBucket)
                    .upload(`${this.m_storagePath}/${uploadedFileName}.${fileExtension}`, file);
    
                if(response.error)
                    throw new Error(response.error.message);
    
                filePath = response.data.path;
    
                debug(`uploaded new file with name: ${uploadedFileName}`);
            }
        }

        const response = await this.m_supabase
            .from(this.m_tableName)
            .insert(filePath !== undefined && this.m_fileKeyName ? {...data, [this.m_fileKeyName]: filePath} : data)
            .select();

        if(response.error)
            throw new Error(response.error.message);

        const addedData = response.data[0] as unknown;

        debug(`added data: ${JSON.stringify(addedData)}`);

        if(this.m_typeGuard){
            if(this.m_typeGuard(addedData))
                return addedData;
            else{
                debug(`failed to typeguard the data, data type is:\n${inferType(addedData)}`);
                throw new Error("Typeguard failed");
            }
        }
        else
            return addedData as DataType;
    }

    async _update(
        id: DataType[IdKey], 
        data: Partial<StrictOmit<DataType, IdKey | OmittedKey | FileKey>>, 
        ...fileOption: ([FileKey] extends [never] ? 
            [] 
            : 
            null extends DataType[FileKey] ? 
                [] | [{file: Blob | null, fileName?: string}] 
                : 
                [{file: Blob, fileName?: string}]
        )
    ): Promise<DataType>{
        debug(`updating data with key: ${id}`);

        const oldData = await this._get(id);

        let filePath: string | null | undefined = undefined;
        if(this.m_fileKeyName && fileOption.length > 0){
            debug(`file option and key name found, uploading or replacing file`);

            // delete the old data first
            if(oldData[this.m_fileKeyName]){
                debug(`old file found, deleting the old file first`);
                debug(`option: ${JSON.stringify(fileOption)}`);

                const fileName = oldData[this.m_fileKeyName] as string;

                if(!fileName)
                    throw new Error("Failed to get image name");

                await this.m_supabase
                    .storage
                    .from(this.m_storageBucket)
                    .remove([fileName]);

                debug(`deleted old file with name: ${fileName}`);
            }

            debug(`uploading new file`);

            const file = fileOption[0]?.file;
            const fileName = fileOption[0]?.fileName;

            if(file === null)
                filePath = null;
            else{
                if(!file)
                    throw new Error("File is missing");
    
                const uploadedFileName = fileName ?? randomUUID();
                const fileExtension = file.type.split("/")[1];
    
                const response = await this.m_supabase
                    .storage
                    .from(this.m_storageBucket)
                    .upload(`${this.m_storagePath}/${uploadedFileName}.${fileExtension}`, file);
    
                if(response.error)
                    throw new Error(response.error.message);
    
                filePath = response.data.path;
    
                debug(`uploaded new file with name: ${uploadedFileName}`);
            }
        }

        const newData = await this.m_supabase
            .from(this.m_tableName)
            .update(filePath !== undefined && this.m_fileKeyName ? {...data, [this.m_fileKeyName]: filePath} : data)
            .eq(this.m_keyName, id)
            .select();

        if(newData.error)
            throw new Error(newData.error.message);

        const updatedData = newData.data[0] as unknown;

        debug(`updated data: ${JSON.stringify(updatedData)}`);


        if(this.m_typeGuard){
            if(this.m_typeGuard(updatedData))
                return updatedData;
            else{
                debug(`failed to typeguard the data, data type is:\n${inferType(updatedData)}`);
                throw new Error("Typeguard failed");
            }
        }
        else
            return updatedData as DataType;
    }

    async _call(functionName: string, args: any): Promise<DataType[]>{
        debug(`calling function: ${functionName}`);

        const response = await this.m_supabase.rpc(functionName, args);

        debug(`response: ${JSON.stringify(response)}`);

        if(response.error)
            throw new Error(response.error.message);

        const data = response.data as unknown[];

        debug(`data: ${JSON.stringify(data)}`);

        if(this.m_typeGuard)
            if(data.every(this.m_typeGuard))
                return data;
            else {
                debug(`failed to typeguard the data, data type is:\n${inferType(data)}`);
                throw new Error("Typeguard failed");
            }
        else
            return data as DataType[];
    }

    async _queryBuilder<_R extends PostgrestFilterBuilder | PostgrestBuilder>(fcn: (query: PostgrestFilterBuilder) => _R): Promise<DataType | DataType[]>{
        debug(`querying data using query builder`);

        const res = await fcn(this.m_supabase.from(this.m_tableName).select("*"));

        if(res.error)
            throw new Error(res.error.message);

        const data = res.data as unknown;

        debug(`data: ${JSON.stringify(data)}`);

        if(this.m_typeGuard){
            if(Array.isArray(data)){
                if(data.every(this.m_typeGuard))
                    return data as DataType[];
                else {
                    debug(`failed to typeguard the data, data type is:\n${inferType(data)}`);
                    throw new Error("Typeguard failed");
                }
            }
            else {
                if(this.m_typeGuard(data))
                    return data as DataType;
                else {
                    debug(`failed to typeguard the data, data type is:\n${inferType(data)}`);
                    throw new Error("Typeguard failed");
                }
            }
        }
        else
            return data as DataType | DataType[];
    }

    // these are public methods that returns translated data

    /**
     * adds new data to the database
     * @param data the data to add
     * @param fileOption optional file to add when the file key is set
     * @returns the added data
     */
    async add(
        data: StrictOmit<DataType, IdKey | OmittedKey | FileKey>, 
        ...fileOption: ([FileKey] extends [never] ? 
            [] 
            : 
            null extends DataType[FileKey] ? 
                [] | [{file: Blob | null, fileName?: string}] 
                : 
                [{file: Blob, fileName?: string}]
        )
    ): Promise<DataType>{
        const addedData = await this._add(data, ...fileOption);

        if(this.m_useCache)
            this.m_cache.set(addedData[this.m_keyName], addedData);

        return this.translateFileToUrl(addedData);
    }

    /**
     * get data from the database, if the data is not found in the cache, it will fetch from the database
     * @param key the key to get the data
     * @returns the data from the database
     */
    async get(key: DataType[IdKey]): Promise<DataType>{
        if(this.m_useCache && this.m_cache.has(key))
            return this.translateFileToUrl(this.m_cache.get(key) as DataType);

        const data = await this._get(key);

        // cache the data
        if(this.m_useCache)
            this.m_cache.set(key, data);

        return this.translateFileToUrl(data);
    }

    /**
     * get all data from the database
     * @returns all data from the database
     */
    async getAll(): Promise<DataType[]>{
        const data = await this._getAll();

        // cache the data
        if(this.m_useCache)
            for(const ele of data)
                this.m_cache.set(ele[this.m_keyName], ele);

        return data.map(value => this.translateFileToUrl(value));
    }

    /**
     * Updates the data in the database, also updates the one in cache
     * 
     * if the data is not found in the database, it will throw an error
     * 
     * @param key the key to update
     * @param data the data to update
     * @param fileOption optional file to update when the file key is set
     */
    async update(
        key: DataType[IdKey], 
        data: Partial<StrictOmit<DataType, IdKey | OmittedKey | FileKey>>, 
        ...fileOption: ([FileKey] extends [never] ? 
            [] 
            : 
            null extends DataType[FileKey] ? 
                [] | [{file: Blob | null, fileName?: string}] 
                : 
                [{file: Blob, fileName?: string}]
        )
    ): Promise<DataType>{
        const updatedData = await this._update(key, data, ...fileOption);

        if(this.m_useCache)
            this.m_cache.set(key, updatedData);

        return this.translateFileToUrl(updatedData);
    }

    /**
     * deletes the data from the database based on the key, also deletes the data from the cache
     * @param key the key to delete 
     */
    async delete(key: DataType[IdKey]): Promise<void>{
        await this._delete(key);

        if(this.m_useCache)
            this.m_cache.delete(key);
    }

    /**
     * Query builder to build a query from the database, the result will be filtered based on the typeguard
     * @param fcn the function to build the query
     * @returns the data that matches the query
     */
    async queryBuilder<_R extends PostgrestFilterBuilder | PostgrestBuilder>(fcn: (query: PostgrestFilterBuilder) => _R): Promise<DataType | DataType[]>{
        const data = await this._queryBuilder(fcn);

        if(Array.isArray(data)){
            if(this.m_useCache)
                for(const ele of data)
                    this.m_cache.set(ele[this.m_keyName], ele);

            return data.map(value => this.translateFileToUrl(value));
        }
        else {
            if(this.m_useCache)
                this.m_cache.set(data[this.m_keyName], data);

            return this.translateFileToUrl(data);
        }
    }

    /**
     * calls a function and then use typeguard to filter the data, this function will reload the entire cache if the cache is enabled
     * @param functionName the function's name
     * @param args arguments
     */
    async call(functionName: string, args: any): Promise<DataType[]>{
        const data = await this._call(functionName, args);

        if(this.m_useCache)
            for(const ele of data)
                this.m_cache.set(ele[this.m_keyName], ele);

        return data.map(value => this.translateFileToUrl(value));
    }
}