import { FileManagerFirebase, ServiceSupabase } from "@library";
import { isRegistlet, Registlet } from "@models";

export class RegistletService {
    static readonly tableName = "registlets";
    static readonly imgDir = "images/registlets";
    
    static serviceSupabase = new ServiceSupabase<Registlet, "id">(
        "id", 
        RegistletService.tableName, 
        {typeGuard: isRegistlet}
    );

    static fileManager = new FileManagerFirebase(RegistletService.imgDir);

    static async translateImageToUrl<_T extends string | Registlet, _R = _T extends string ? string : Registlet>(registletOrPath: _T): Promise<_R>{
        if(typeof registletOrPath === "string")
            return await RegistletService.fileManager.getUrlFromPath(registletOrPath) as _R;
        else if (typeof registletOrPath === "object")
            return {...registletOrPath, img_path: registletOrPath.img_path && await RegistletService.fileManager.getUrlFromPath(registletOrPath.img_path)} as _R;
        else 
            throw Error("Never");
    }

    static async getAll(): Promise<Registlet[]>{
        return await Promise.all(RegistletService
            .serviceSupabase
            .cache
            .map(RegistletService.translateImageToUrl));
    }

    static async getRegistletByName(name: string): Promise<Registlet[]>{
        if(name.length < 3)
            throw new Error("Name must be at least 3 characters long");

        const res = RegistletService.serviceSupabase.cache.filter(e => e.name.match(new RegExp(name, "i")));

        if(res.length === 0){
            // if not found try to search in database
            const data = await RegistletService.serviceSupabase.client.select("*").ilike("name", `%${name}%`);

            if(data.error)
                throw new Error(data.error.message);

            return await Promise.all(data.data.filter(isRegistlet).map(RegistletService.translateImageToUrl));
        }

        return await Promise.all(res.map(RegistletService.translateImageToUrl));
    }

    static async setNewRegistlet(registlet: Omit<Registlet, "id">, imgUrl?: string): Promise<Registlet>{
        const newRegistlet = await RegistletService.serviceSupabase.add(registlet);

        if(!newRegistlet)
            throw new Error("Failed to create new registlet");

        if(imgUrl){
            // file name format will be registlet_title.extension
            const imgName = registlet.name.replace(/\s/g, "_").toLowerCase();

            const res = await RegistletService.fileManager.uploadImage(imgUrl, imgName);

            if(res)
                await RegistletService.serviceSupabase.update(newRegistlet.id, {...registlet, img_path: `${RegistletService.imgDir}/${res.metadata.name}`});

            // if(data)
            //     return await RegistletService.translateImageToUrl(data);
            // else
            //     throw new Error("Failed to update the registlet");
        }

        return newRegistlet;
    }
}