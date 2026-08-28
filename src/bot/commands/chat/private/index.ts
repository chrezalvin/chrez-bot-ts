import bulkDelete from "./bulkdelete";
import why from "./why";
import mute from "./setmute";
import unmute from "./unmute";
// import addRecommend from "./addRecommend";
import absoluteMute from "./absoluteMute";
// import guide from "./guide";
import { ChatCommand } from "@commands/types";
// import notifyRaid from "./notifyRaid";

export const commands = [
    bulkDelete,
    why,
    mute,
    unmute,
    // addRecommend,
    absoluteMute,    
    // guide,
    // notifyRaid
] as ChatCommand[];