import { rngInt } from "@library";
import {FileManagerSupabase} from "@library";
import { supabase } from "@shared/supabase";

export class CursedService{
    protected static readonly imgPath: string = "cursed";
    protected static readonly imgBucket: string = "images";

    static fileManager = new FileManagerSupabase(
        supabase, 
        CursedService.imgBucket, 
        CursedService.imgPath
    );

    static getCursedList(){
        return CursedService.fileManager.cache;
    }

    static getCursedUrl(index?: number): string{
        let rand = index ?? rngInt(0, CursedService.fileManager.length - 1);

        return CursedService.fileManager.get(rand);
    }
}