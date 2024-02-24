import privateCommands from "../private";

import cry from "./cry";
import weirdThing from "./weirdThing";
import { CommandBuilder } from "@library";

const c: (CommandBuilder<any>)[] = [
    cry,
    weirdThing
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("hidden"));

export default c;