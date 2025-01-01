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
].filter(command => command.mode !== "unavailable");

export default commands;