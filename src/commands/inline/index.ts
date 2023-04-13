import { inlineCommandReturnTypes } from "@typings/customTypes";
import pewpew from "./pewpew";
import greet from "./greet";
import die from "./die";

export const commands: inlineCommandReturnTypes[] = [
    pewpew,
    greet,
    die
].filter(command => !command.unavailable);;

export default commands;