import { CommandReturnTypes } from "@typings/customTypes";
import bulkDelete from "./bulkdelete";
import why from "./why";
import laugh from "./laugh";
import agree from "./agree";
import disagree from "./disagree";

export const commands: CommandReturnTypes[] = [
    bulkDelete,
    why,
    laugh,
    agree,
    disagree
].filter(command => !command.unavailable);

export default commands;