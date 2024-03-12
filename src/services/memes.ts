import { FileManager, rngInt } from "@library";

export class MemeService{
    protected static readonly memePathSfw = "images/memes/sfw";
    protected static readonly memePathNsfw = "images/memes/nsfw";

    public static fileManagerNsfw = new FileManager(MemeService.memePathNsfw);
    public static fileManagerSfw = new FileManager(MemeService.memePathSfw);

    static getMemeList(nsfw: boolean = false){
        if(nsfw)
            return MemeService.fileManagerNsfw.cache;
        else return MemeService.fileManagerSfw.cache;
    }

    static async getMemeUrl(nsfw: boolean = false, index?: number): Promise<string>{
        const service: FileManager = nsfw ? MemeService.fileManagerNsfw : MemeService.fileManagerSfw;
        const rand = service.cache[index ?? rngInt(0, service.cache.length - 1)];

        return await service.getUrlFromPath(rand.fullPath);
    }
}