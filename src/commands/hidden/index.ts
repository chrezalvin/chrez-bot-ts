import cry from "./cry";
import weirdThing from "./weirdThing";
import rice from "./rice";
import roshambo from "./roshambo";
import agree from "./agree";
import hello from "./hello";
import embedify from "./embedify";
import laugh from "./laugh";
import disagree from "./disagree";
import hug from "./hug";
import yomama from "./yomama";
import translate from "./translate";
import convert from "./convert";

import { CommandBuilder } from "@library";

const commandList: (CommandBuilder<any>)[] = [
    cry,
    rice,
    weirdThing,
    roshambo,
    agree,
    hello,
    embedify,
    laugh,
    disagree,
    hug,
    yomama,
    translate,
    convert,
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("hidden"));

export default commandList;