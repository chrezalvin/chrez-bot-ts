import { ChatCommand } from "@commands/types";
import calculate from "./calculate";
import crafting from "./crafting";
import cursed from "./cursed";
import event from "./event";
import foodBuffCode from "./foodBuffCode";
import levelling from "./levelling";
import memes from "./memes";
import pause from "./pause";
import play from "./play";
import queue from "./queue";
import registlet from "./registlet";
import remove from "./remove";
import repeat from "./repeat";
import resume from "./resume";
import roll from "./roll";
import skip from "./skip";
import stop from "./stop";
import story from "./story";
import time from "./time";
import trait from "./trait";
import update from "./update";
import quote from "./quote";
import item from "./item";
import enemy from "./enemy";

export const chatCommand =  [
    calculate,
    crafting,
    cursed,
    event,
    foodBuffCode,
    levelling,
    memes,
    pause,
    play,
    queue,
    registlet,
    remove,
    repeat,
    resume,
    roll,
    skip,
    stop,
    story,
    time,
    trait,
    update,
    quote,
    item,
    enemy,
] as ChatCommand[];

export default chatCommand;