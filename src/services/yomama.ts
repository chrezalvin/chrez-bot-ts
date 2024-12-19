import { rngInt, ServiceFileSupabase } from "@library";
import { isYomama, Yomama } from "@models";

export class YomamaService{
    protected static readonly tableName = "yomama";

    public static service = new ServiceFileSupabase<Yomama, "id">("id", 
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

    public static async getAllYomama(): Promise<Yomama[]>{
        return await YomamaService.service.getAll();
    }

    public static async addYomama(yomama: Omit<Yomama, "id">): Promise<Yomama | undefined>{
        return await YomamaService.service.add(yomama);
    }

    public static async deleteYomama(id: Yomama["id"]): Promise<void>{
        await YomamaService.service.delete(id);
    }

    public static async updateYomama(id: Yomama["id"], yomama: Partial<Omit<Yomama, "id">>): Promise<Yomama | undefined>{
        return await YomamaService.service.update(id, yomama);
    }
}

export default YomamaService;