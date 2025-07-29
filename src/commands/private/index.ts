import { CommandBuilder } from "@library";
import bulkDelete from "./bulkdelete";
import why from "./why";
import mute from "./setmute";
import unmute from "./unmute";
import addRecommend from "./addRecommend";
import absoluteMute from "./absoluteMute";
// import notifyRaid from "./notifyRaid";

export const commands: (CommandBuilder<any>)[] = [
    bulkDelete,
    why,
    mute,
    unmute,
    addRecommend,
    absoluteMute,    
    // notifyRaid
]
.filter(command => command.mode !== "unavailable")
.map(command => {
    if(command.status !== "owner")
        command.setStatus("private")
    return command;
});

export default commands;