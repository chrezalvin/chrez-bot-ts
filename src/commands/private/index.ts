import { CommandBuilder } from "@library";
import bulkDelete from "./bulkdelete";
import why from "./why";
import mute from "./setmute";
import unmute from "./unmute";
import addRecommend from "./addRecommend";
// import notifyRaid from "./notifyRaid";

export const commands: (CommandBuilder<any>)[] = [
    bulkDelete,
    why,
    mute,
    unmute,
    addRecommend,
    // notifyRaid
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("private"));

export default commands;