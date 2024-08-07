import { rngInt } from "@library";
import {ServiceSupabase} from "@library";
import { isYomama, Yomama } from "@models";

export class YomamaService{
    protected static readonly tableName = "yomama";

    public static service = new ServiceSupabase<Yomama, "id">("id", YomamaService.tableName, {typeGuard: isYomama});

    public static async getYomama(index?: number): Promise<Yomama | undefined>{
        const idx = index ?? rngInt(0, YomamaService.service.cache.length - 1);

        return await YomamaService.service.get(idx);
    }
}

export default YomamaService;