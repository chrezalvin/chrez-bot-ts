import {ServiceSupabase} from "@library";
import { Update, isUpdate } from "@models";

class Testing<
        Type extends Object, 
        Key extends Extract<keyof Type, string>,
        OmitKey extends keyof Type = never
    >{
    data: Type;

    constructor(data: Type){
        this.data = data;
    }

    addData(newData: Omit<Type, Key | OmitKey>): Type{
        return {} as Type;
    }

    updateData(key: Key, newData: Partial<Omit<Type, OmitKey>>): Type{
        return {} as Type;
    }

    deleteData(key: Key): void{
        return;
    }

    getData(key: Key): Type{
        return {} as Type;
    }
}

interface MyType{
    a: string;
    b: number;
    c: number;
    d: string;
}

new Testing<MyType, "a">( {a: "a", b: 1, c: 2, d: "d"} );

type MyTypeOmitted = Omit<MyType, "a" | "b">;

export class UpdateService{
    protected static dbName = "updates";

    public static serviceSupabase = new ServiceSupabase<Update, "version">( 
        "version", 
        UpdateService.dbName, 
        {typeGuard: isUpdate,}
    );

    static isUpdate(obj: unknown): obj is Update{
        if(typeof obj !== "object" || obj === null) return false;
    
        // update can have either news or bugfix or both
        if("news" in obj && "bugfix" in obj) return true;
        else if("news" in obj && !("bugfix" in obj)) return true;
        else if(!("news" in obj) && "bugfix" in obj) return true;
        else
            return false;
    }

    public static async getUpdate(version: string): Promise<Update>{
        const find = await UpdateService.serviceSupabase.get(version);

        if(!find)
            throw new Error("version not found");

        // return first occurence
        return find;
    }

    public static async getAllUpdate(): Promise<Update[]>{
        const allData = await UpdateService.serviceSupabase.getAll();
        const arr = Array.from(allData.values());

        return arr;
    }

    public static async deleteUpdate(version: string): Promise<void>{
        const find = await UpdateService.serviceSupabase.get(version);

        if(!find)
            throw new Error("version not found");

        await UpdateService.serviceSupabase.delete(version);
    }

    public static async addUpdate(update: Update): Promise<Update | undefined>{
        return await UpdateService.serviceSupabase.add(update);
    }

    public static async editUpdate(version: string, update: Partial<Omit<Update, "id">>): Promise<Update | undefined>{
        return await UpdateService.serviceSupabase.update(version, update);
    }
}