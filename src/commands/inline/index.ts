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
import ee from "./ee";
import yousuck from "./yousuck";
import pika from "./pika";
import detect from "./detect";

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
    ee,
    yousuck,
    pika,
    detect,
].filter(command => !command.unavailable);

export default commands;