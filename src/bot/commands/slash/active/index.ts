import { SlashCommand } from "../../types";
import calculate from "./calculate";
import crafting from "./crafting";
import registlet from "./registlet";
import update from "./update";
import play from "./play";
import pause from "./pause";
import stop from "./stop";
import resume from "./resume";
import queue from "./queue";
import remove from "./remove";
import skip from "./skip";
import trait from "./trait";
import roll from "./roll";
import time from "./time";

export const commands = [
    calculate,
    crafting,
    registlet,
    update,
    play,
    pause,
    stop,
    resume,
    queue,
    remove,
    skip,
    trait,
    roll,
    time,
] as SlashCommand[];

export default commands;