import { ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { Update, isUpdate } from "@models";
import { supabase } from "@shared/supabase";

export class UpdateService{
    protected static dbName = "updates";

    public static serviceSupabase = new ServiceFileSupabase<Update, "version">( 
        supabase,
        "version", 
        {
            tableName: UpdateService.dbName,
            typeGuard: isUpdate,
            useCache: true,
        }
    );

    public static async getUpdate(version: string): Promise<Update>{
        return await UpdateService.serviceSupabase.get(version);
    }

    public static async getAllUpdate(): Promise<Update[]>{
        return await UpdateService.serviceSupabase.getAll();
    }

    public static async deleteUpdate(version: string): Promise<void>{
        await UpdateService.serviceSupabase.delete(version);
    }

    public static async addUpdate(update: Update): Promise<Update | undefined>{
        return await UpdateService.serviceSupabase.add(update);
    }

    public static async editUpdate(version: Update["version"], update: Partial<StrictOmit<Update, "version">>): Promise<Update | undefined>{
        return await UpdateService.serviceSupabase.update(version, update);
    }
}