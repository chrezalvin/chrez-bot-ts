import { ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { isRegistlet, Registlet } from "@models";
import { supabase } from "@shared/supabase";

export class RegistletService {
    static readonly tableName = "registlets";
    static readonly imgDir = "images/registlets";
    static readonly bucketName = "images";

    static serviceSupabase = new ServiceFileSupabase<Registlet, "registlet_id", never, "img_path">(
        supabase,
        "registlet_id", 
        {
            tableName: RegistletService.tableName,
            typeGuard: isRegistlet,
            useCache: true,
        },
        {
            bucketName: RegistletService.bucketName,
            storagePath: RegistletService.imgDir,
            fileKey: "img_path",
        }
    );

    static async getAll(): Promise<Registlet[]>{
        return await RegistletService.serviceSupabase.getAll();
    }

    static async getRegistletByName(name: Registlet["name"]): Promise<Registlet[]>{
        if(name.length < 3)
            throw new Error("Name must be at least 3 characters long");

        const res = await RegistletService
            .serviceSupabase
            .queryBuilder((query) => query
                .select("*")
                .ilike("name", `%${name}%`)
            );

        if(!Array.isArray(res))
            throw new Error("Failed to get registlet");

        return res;
    }

    static async setNewRegistlet(registlet: StrictOmit<Registlet, "registlet_id" | "img_path">, imgBlob?: Blob): Promise<Registlet>{
        const fileName = registlet.name.replace(/\s/g, "_").toLowerCase();
        const newRegistlet = await RegistletService.serviceSupabase.add(registlet, {
            file: imgBlob ?? null,
            fileName,
        });

        return newRegistlet;
    }

    static async updateRegistlet(
        id: Registlet["registlet_id"], 
        registlet: Partial<StrictOmit<Registlet, "registlet_id">>, 
        imgBlob?: Blob
    ): Promise<Registlet>{
        const regi = await RegistletService.serviceSupabase.get(id);
        const newFileName = (registlet.name ?? regi.name).replace(/\s/g, "_").toLowerCase();

        if(imgBlob)
            return await RegistletService.serviceSupabase.update(id, registlet, {file: imgBlob, fileName: newFileName});
        else
            return await RegistletService.serviceSupabase.update(id, registlet);
    }

    static async deleteRegistlet(id: Registlet["registlet_id"]): Promise<void>{
        await RegistletService.serviceSupabase.delete(id);
    }
}