import { InlineCommand } from "../types";
import ctest from "./ctest";
import detect from "./detect";
import die from "./die";
import dontyell from "./dontyell";
import ee from "./ee";
import greet from "./greet";
import itsokay from "./itsokay";
import no from "./no";
import pewpew from "./pewpew";
import pika from "./pika";
import sad from "./sad";
// import thanks from "./thanks";
import thatsucks from "./thatsucks";
import yay from "./yay";
import yousuck from "./yousuck";

export const inline_commands = [
    ctest,
    detect,
    die,
    dontyell,
    ee,
    greet,
    itsokay,
    no,
    pewpew,
    pika,
    sad,
    // thanks,
    thatsucks,
    yay,
    yousuck,
] as InlineCommand[];