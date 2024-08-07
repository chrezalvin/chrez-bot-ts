import { rngInt } from "@library";
import {FileManagerSupabase} from "@library";

export class MemeService{
    protected static readonly memePathSfw = "memes/sfw";
    protected static readonly memePathNsfw = "memes/nsfw";

    protected static readonly bucketImage = "images";

    public static fileManagerNsfw = new FileManagerSupabase(MemeService.bucketImage, MemeService.memePathNsfw);
    public static fileManagerSfw = new FileManagerSupabase(MemeService.bucketImage, MemeService.memePathSfw);

    static getMemeList(nsfw: boolean = false){
        if(nsfw)
            return MemeService.fileManagerNsfw.cache;
        else return MemeService.fileManagerSfw.cache;
    }

    static async getMemeUrl(nsfw: boolean = false, index?: number): Promise<string>{
        const service: FileManagerSupabase = nsfw ? MemeService.fileManagerNsfw : MemeService.fileManagerSfw;
        const rand = service.cache[index ?? rngInt(0, service.length - 1)];

        return rand;
    }
}