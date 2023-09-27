import { inlineCommandReturnTypes } from "@typings/customTypes";
import pewpew from "./pewpew";
import greet from "./greet";
import die from "./die";
import yay from "./yay";

export const commands: inlineCommandReturnTypes[] = [
    pewpew,
    greet,
    die,
    yay
].filter(command => !command.unavailable);;

export default commands;