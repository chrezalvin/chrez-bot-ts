import { inlineCommandReturnTypes } from "@typings/customTypes";
import pewpew from "./pewpew";
import greet from "./greet";

export const commands: inlineCommandReturnTypes[] = [
    pewpew,
    greet
].filter(command => !command.unavailable);;

export default commands;