import { inlineCommandReturnTypes } from "@library";
import pewpew from "./pewpew";
import greet from "./greet";
import die from "./die";
import yay from "./yay";
import test from "./ctest";
import lick from "./lick";
import sad from "./sad";
import dontYell from "./dontyell";
import no from "./no";
import itsokay from "./itsokay";

export const commands: inlineCommandReturnTypes[] = [
    pewpew,
    greet,
    die,
    yay,
    test,
    lick,
    sad,
    dontYell,
    no,
    itsokay,
].filter(command => !command.unavailable);

export default commands;