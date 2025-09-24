import { inlineCommandReturnTypes, CommandBuilder } from "@library";
import volume from "./volume";
import playlist from "./playlist";

const commandDump: (CommandBuilder<any> | inlineCommandReturnTypes)[] = [
    volume,
    playlist,
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