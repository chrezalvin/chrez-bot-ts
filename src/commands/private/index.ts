import { CommandReturnTypes } from "@typings/customTypes";
import bulkDelete from "./bulkdelete";
import why from "./why";
import laugh from "./laugh";
import agree from "./agree";
import disagree from "./disagree";
import mute from "./setmute";
// import notifyRaid from "./notifyRaid";
import { CommandBuilder } from "@modules/CommandBuilder";

export const commands: (CommandBuilder<any>)[] = [
    bulkDelete,
    why,
    laugh,
    agree,
    disagree,
    mute,
    // notifyRaid
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("private"));

export default commands;