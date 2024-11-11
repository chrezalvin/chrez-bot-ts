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

    static async setNewRegistlet(registlet: Omit<Registlet, "id">, imgBlob?: Blob): Promise<Registlet>{
        const newRegistlet = await RegistletService.serviceSupabase.add(registlet);

        if(!newRegistlet)
            throw new Error("Failed to create new registlet");

        if(!imgBlob)
            return newRegistlet;

        // file name format will be registlet_title.extension
        const imgName = registlet.name.replace(/\s/g, "_").toLowerCase();

        const res = await RegistletService.fileManager.uploadImage(imgBlob, imgName);

        if(!res)
            throw new Error("Failed to upload the image");

        const resRegi = await RegistletService.serviceSupabase.update(newRegistlet.id, {...registlet, img_path: res.metadata.fullPath});

        if(!resRegi)
            throw new Error("Failed to upload image");

        return await RegistletService.translateImageToUrl(resRegi);
    }

    static async updateRegistlet(id: Registlet["id"], registlet: Partial<Omit<Registlet, "id">>, imgBlob?: Blob): Promise<Registlet>{
        const regi = await RegistletService.serviceSupabase.get(id);

        if(!regi)
            throw new Error("Registlet not found");

        const updatedRegistlet = await RegistletService.serviceSupabase.update(id, registlet);

        if(!updatedRegistlet)
            throw new Error("Failed to update registlet");

        if(!imgBlob)
            return RegistletService.translateImageToUrl(updatedRegistlet);

        if(regi.img_path){
            const fileName = regi.img_path.split("/").pop();

            if(!fileName)
                throw new Error("Failed to get image name");

            await RegistletService.fileManager.deleteImage(fileName);
        }

        let fileName: string;
        if(registlet.name)
            fileName = registlet.name.replace(/\s/g, "_").toLowerCase();
        else
            fileName = regi.name.replace(/\s/g, "_").toLowerCase();

        const updatedImageRegistlet = await RegistletService.fileManager.uploadImage(imgBlob, fileName);

        if(!updatedImageRegistlet)
            throw new Error("Failed to upload image");

        const res = await RegistletService.serviceSupabase.update(id, {...registlet, img_path: updatedImageRegistlet.metadata.fullPath});

        if(!res)
            throw new Error("Failed to update image path");

        return await RegistletService.translateImageToUrl(res);
    }

    static async deleteRegistlet(id: Registlet["id"]){
        const regi = await RegistletService.serviceSupabase.get(id);

        if(!regi)
            throw new Error("Registlet not found");

        if(regi.img_path){
            const fileName = regi.img_path.split("/").pop();

            if(!fileName)
                throw new Error("Failed to get image name");

            await RegistletService.fileManager.deleteImage(fileName);
        }

        await RegistletService.serviceSupabase.delete(regi.id);
    }
}