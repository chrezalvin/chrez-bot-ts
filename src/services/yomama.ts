import { rngInt, ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { isYomama, Yomama } from "@models";
import { supabase } from "@shared/supabase";

export class YomamaService{
    protected static readonly tableName = "yomama";

    public static service = new ServiceFileSupabase<Yomama, "yomama_id">(
        supabase,
        "yomama_id", 
        {
            typeGuard: isYomama,
            tableName: YomamaService.tableName,
            useCache: false,
        }
    );

    public static async getYomama(index?: number): Promise<Yomama | undefined>{
        const idx = index ?? rngInt(0, YomamaService.service.cache.length - 1);

        return await YomamaService.service.get(idx);
    }

    public static async getYomamaById(id: Yomama["yomama_id"]): Promise<Yomama | undefined>{
        return await YomamaService.service.get(id);
    }

    public static async getAllYomama(): Promise<Yomama[]>{
        return await YomamaService.service.getAll();
    }

    public static async addYomama(yomama: StrictOmit<Yomama, "yomama_id">): Promise<Yomama | undefined>{
        return await YomamaService.service.add(yomama);
    }

    public static async deleteYomama(id: Yomama["yomama_id"]): Promise<void>{
        await YomamaService.service.delete(id);
    }

    public static async updateYomama(id: Yomama["yomama_id"], yomama: Partial<StrictOmit<Yomama, "yomama_id">>): Promise<Yomama | undefined>{
        return await YomamaService.service.update(id, yomama);
    }
}

export default YomamaService;