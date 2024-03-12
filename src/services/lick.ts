import { FileManager, rngInt } from "@library";

export class LickService{
    protected static readonly imgPath = "images/licks";
    static fileManager = new FileManager(LickService.imgPath);

    static async getLickUrl(index?: number): Promise<string>{
        const cache  = LickService.fileManager.cache;
        const rand = index ?? rngInt(0, cache.length);

        return await LickService.fileManager.getUrlFromPath(cache[rand].fullPath);
    }
}