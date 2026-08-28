import { QuoteView } from "@services/supabase/types/views/QuoteView";
import { RegistletViewService } from "../viewService";
import { MappedArray } from "@library/MappedArray";
import { RegistletView } from "@services/supabase/types/views/RegistletView";

const cache = new MappedArray<QuoteView["quote_id"], QuoteView>();

export async function getRegistlets(keyword: string): Promise<RegistletView[]>{
    const registlet = await RegistletViewService.getRegistlets(keyword);

    return registlet;
}