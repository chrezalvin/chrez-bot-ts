import { ChatCommand } from "@commands/types";
import agree from"./agree"
import convert from"./convert"
import cry from"./cry"
import disagree from"./disagree"
import hello from"./hello"
import hug from"./hug"
import laugh from"./laugh"
import rice from"./rice"
import roshambo from"./roshambo"
import translate from"./translate"
import weirdThing from"./weirdThing"
import yomama from"./yomama";
import ailment from"./ailment";

export const commands = [
    agree,
    convert,
    cry,
    disagree,
    hello,
    hug,
    laugh,
    rice,
    roshambo,
    translate,
    weirdThing,
    yomama,
    ailment,
] as ChatCommand[];

export default commands;