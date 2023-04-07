import { CommandReturnTypes } from "@typings/customTypes";
import bulkDelete from "./bulkdelete";
import why from "./why";
import laugh from "./laugh";

export const commands: CommandReturnTypes[] = [
    bulkDelete,
    why,
    laugh
].filter(command => !command.unavailable);

export default commands;