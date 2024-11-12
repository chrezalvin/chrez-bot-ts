import cry from "./cry";
import weirdThing from "./weirdThing";
import rice from "./rice";
import { CommandBuilder } from "@library";

const commandList: (CommandBuilder<any>)[] = [
    cry,
    rice,
    weirdThing,
]
.filter(command => command.mode !== "unavailable")
.map(command => command.setStatus("hidden"));

export default commandList;