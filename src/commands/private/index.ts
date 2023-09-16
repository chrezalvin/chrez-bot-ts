import { CommandReturnTypes } from "@typings/customTypes";
import bulkDelete from "./bulkdelete";
import why from "./why";
import laugh from "./laugh";
import agree from "./agree";
import disagree from "./disagree";
import mute from "./setmute";

export const commands: CommandReturnTypes[] = [
    bulkDelete,
    why,
    laugh,
    agree,
    disagree,
    mute
].filter(command => !command.unavailable);

export default commands;