import privateCommands from "../private";

import cry from "./cry";
import weirdThing from "./weirdThing";
import rice from "./rice";
import { CommandBuilder } from "@library/CommandBuilder";

const c: (CommandBuilder<any>)[] = [
    cry,
    weirdThing,
    rice,
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("hidden"));

export default c;