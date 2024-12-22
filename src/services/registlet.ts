import { ServiceFileSupabase } from "@library";
import { isRegistlet, Registlet } from "@models";

export class RegistletService {
    static readonly tableName = "registlets";
    static readonly imgDir = "images/registlets";
    static readonly bucketName = "images";

    static serviceSupabase = new ServiceFileSupabase<Registlet, "id", never, "img_path">("id", 
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

    static async getRegistletByName(name: string): Promise<Registlet[]>{
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

    static async setNewRegistlet(registlet: Omit<Registlet, "id">, imgBlob?: Blob): Promise<Registlet>{
        const fileName = registlet.name.replace(/\s/g, "_").toLowerCase();
        const newRegistlet = await RegistletService.serviceSupabase.add(registlet, {
            file: imgBlob ?? null,
            fileName,
        });

        return newRegistlet;
    }

    static async updateRegistlet(id: Registlet["id"], registlet: Partial<Omit<Registlet, "id">>, imgBlob?: Blob): Promise<Registlet>{
        const regi = await RegistletService.serviceSupabase.get(id);
        const newFileName = (registlet.name ?? regi.name).replace(/\s/g, "_").toLowerCase();

        if(imgBlob)
            return await RegistletService.serviceSupabase.update(id, registlet, {file: imgBlob, fileName: newFileName});
        else
            return await RegistletService.serviceSupabase.update(id, registlet);
    }

    static async deleteRegistlet(id: Registlet["id"]): Promise<void>{
        await RegistletService.serviceSupabase.delete(id);
    }
}