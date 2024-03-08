import { inlineCommandReturnTypes, CommandBuilder } from "@library";

import event from "./event";

const commandDump: (CommandBuilder<any> | inlineCommandReturnTypes)[] = [
    event,
    // dyePrice    
]

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