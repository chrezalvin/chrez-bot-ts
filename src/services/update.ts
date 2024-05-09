import { Service } from "@library/Service";

export interface I_Update{
    version: string;
    news?: string[];
    bugfix?: string[];
}

export class UpdateService{
    protected static dbName = "update";
    static isUpdate(obj: unknown): obj is I_Update{
        if(typeof obj !== "object" || obj === null) return false;
    
        // update can have either news or bugfix or both
        if("news" in obj && "bugfix" in obj) return true;
        else if("news" in obj && !("bugfix" in obj)) return true;
        else if(!("news" in obj) && "bugfix" in obj) return true;
        else
            return false;
    }

    public static service: Service<I_Update> = new Service<I_Update>({
        dbName: UpdateService.dbName,
        typeGuard: UpdateService.isUpdate
    });

    public static getUpdate(version: string): I_Update{
        const find = UpdateService.service.findFirst((update) => update.version === version);

        if(!find)
            throw new Error("version not found");

        // return first occurence
        return find.data;
    }

    public static async getAllUpdate(): Promise<I_Update[]>{
        const allData = await UpdateService.service.getAllData();
        const arr = Array.from(allData.values());

        return arr;
    }

    public static async deleteUpdate(version: string): Promise<void>{
        const find = UpdateService.service.findFirst((update) => update.version === version);

        if(!find)
            throw new Error("version not found");

        await UpdateService.service.deleteData(find.id);
    }

    public static async addUpdate(version: string, update: I_Update): Promise<void>{
        // check if the version is already exist        
        const allData = await UpdateService.service.findFirst((update) => update.version === version);

        if(allData)
            throw new Error("version already exist");

        await UpdateService.service.addData(update, version);
    }

    public static async editUpdate(version: string, update: I_Update): Promise<I_Update>{
        const find = UpdateService.service.findFirst((update) => update.version === version);

        if(!find)
            throw new Error("version not found");

        await UpdateService.service.updateData(find.id, update);

        return update;
    }
}