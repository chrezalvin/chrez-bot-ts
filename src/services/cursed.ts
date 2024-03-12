import { FileManager, rngInt } from "@library";

export class CursedService{
    static imgPath = "images/cursed";
    static fileManager = new FileManager(CursedService.imgPath);

    static getCursedList(){
        return CursedService.fileManager.cache;
    }

    static async getCursedUrl(index?: number){
        const cache = CursedService.fileManager.cache;
        let rand = index ?? rngInt(0, cache.length - 1);

        return await CursedService.fileManager.getUrlFromPath(cache[rand].fullPath);
    }
}