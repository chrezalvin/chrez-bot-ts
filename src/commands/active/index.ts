import roll from "./roll";
import calculate from "./calculate";
import quote from "./quote";
import story from "./story";
import time from "./time";
import memes from "./memes";
import cursed from "./cursed";
import update from "./update";
import recommend from "./recommend";
// import convert from "./convert";
import event from "./event";
import registlet from "./registlet";
import play from "./play";
import pause from "./pause";
import resume from "./resume";
import queue from "./queue";
import stop from "./stop";
import remove from "./remove";
import repeat from "./repeat";
import skip from "./skip";
import detect from "./detect";
import trait from "./trait";
import foodBuffCode from "./foodBuffCode";
import crysta from "./crysta";
import levelling from "./levelling";
import crafting from "./crafting";
import { CommandBuilder } from "@library";

export const commands: (CommandBuilder<any>)[] = [
    roll,
    calculate,
    quote,
    story,
    time,
    memes,
    cursed,
    update,
    recommend,
    // convert,
    event,
    registlet,
    play,
    pause,
    resume,
    queue,
    stop,
    remove,
    repeat,
    skip,
    detect,
    trait,
    foodBuffCode,
    // crysta,
    levelling,
    crafting,
].filter(command => command.mode !== "unavailable");

export default commands;