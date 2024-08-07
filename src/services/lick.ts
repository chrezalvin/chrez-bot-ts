import { rngInt } from "@library";
import {FileManagerSupabase} from "@library";

export class LickService{
    protected static readonly imgPath = "licks";
    protected static readonly bucket = "images";
    static fileManager = new FileManagerSupabase(LickService.bucket, LickService.imgPath);

    static getLickUrl(index?: number): string{
        const rand = index ?? rngInt(0, LickService.fileManager.length - 1);

        return LickService.fileManager.get(rand);
    }
}