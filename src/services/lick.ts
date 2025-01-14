import { rngInt } from "@library";
import {FileManagerSupabase} from "@library";
import { supabase } from "@shared/supabase";

export class LickService{
    protected static readonly imgPath = "licks";
    protected static readonly bucket = "images";
    static fileManager = new FileManagerSupabase(supabase, LickService.bucket, LickService.imgPath);

    static getLickUrl(index?: number): string{
        const rand = index ?? rngInt(0, LickService.fileManager.length - 1);

        return LickService.fileManager.get(rand);
    }
}