import { StoodieView } from "@services/supabase/types/views/StoodieView";
import { StoodieViewService } from "../viewService";
export { getStoodieByKeyword } from "../viewService/StoodieViewService";

export async function getStoodie(stoodie: StoodieView["stoodie"]): Promise<StoodieView>{
    const get = await StoodieViewService.getStoodie(stoodie);

    if(!get)
        throw new Error("stoodie not found!");

    return get;
}