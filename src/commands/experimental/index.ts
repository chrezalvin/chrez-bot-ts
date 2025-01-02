import { inlineCommandReturnTypes, CommandBuilder } from "@library";
import play from "./play";
import stop from "./stop";
import pause from "./pause";
import skip from "./skip";
import resume from "./resume";
import remove from "./remove";
import queue from "./queue";
import volume from "./volume";

const commandDump: (CommandBuilder<any> | inlineCommandReturnTypes)[] = [
    play,
    stop,
    pause,
    skip,
    queue,
    resume,
    remove,
    volume,
];

let commands: (CommandBuilder<any>)[] = [];

let inlines: (inlineCommandReturnTypes)[] = [];

for(const unknownCommand of commandDump){
    if(CommandBuilder.isCommandBuilder(unknownCommand)){
        if(unknownCommand.mode === "unavailable") continue;

        commands.push(unknownCommand.setMode("experimental"));
    }
    else{
        if(unknownCommand.unavailable) continue;

        inlines.push(unknownCommand);
    }    
}

export default {commands, inlines};