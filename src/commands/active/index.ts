import roll from "./roll";
import calculate from "./calculate";
import quote from "./quote";
import yomama from "./yomama";
import story from "./story";
import time from "./time";
import memes from "./memes";
import cursed from "./cursed";
import update from "./update";
import recommend from "./recommend";
import convert from "./convert";
import { CommandBuilder } from "@library";
import event from "./event";
import registlet from "./registlet";
import translate from "./translate";
import play from "./play";
import pause from "./pause";
import resume from "./resume";
import queue from "./queue";
import stop from "./stop";
import remove from "./remove";
import repeat from "./repeat";
import skip from "./skip";

export const commands: (CommandBuilder<any>)[] = [
    roll,
    calculate,
    quote,
    yomama,
    story,
    time,
    memes,
    cursed,
    update,
    recommend,
    convert,
    event,
    registlet,
    translate,
    play,
    pause,
    resume,
    queue,
    stop,
    remove,
    repeat,
    skip,
].filter(command => command.mode !== "unavailable");

export default commands;