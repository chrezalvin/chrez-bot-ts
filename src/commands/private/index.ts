import { CommandReturnTypes } from "library/customTypes";
import bulkDelete from "./bulkdelete";
import why from "./why";
import laugh from "./laugh";
import agree from "./agree";
import disagree from "./disagree";
import mute from "./setmute";
import unmute from "./unmute";
import addRecommend from "./addRecommend";
// import notifyRaid from "./notifyRaid";
import { CommandBuilder } from "@library/CommandBuilder";

export const commands: (CommandBuilder<any>)[] = [
    bulkDelete,
    why,
    laugh,
    agree,
    disagree,
    mute,
    unmute,
    addRecommend,
    // notifyRaid
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("private"));

export default commands;