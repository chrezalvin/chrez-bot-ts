import { inlineCommandReturnTypes } from "@typings/customTypes";
import pewpew from "./pewpew";
import greet from "./greet";
import die from "./die";
import yay from "./yay";
import test from "./ctest";
import lick from "./lick";

export const commands: inlineCommandReturnTypes[] = [
    pewpew,
    greet,
    die,
    yay,
    test,
    lick
].filter(command => !command.unavailable);

export default commands;