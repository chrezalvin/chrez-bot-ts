import { CommandReturnTypes, inlineCommandReturnTypes, isCommandReturnType, isInline } from "@typings/customTypes";

import event from "./event";
import dyePrice from "./dyePrice";
import { CommandBuilder } from "@modules/CommandBuilder";

const commandDump: (CommandBuilder<any> | inlineCommandReturnTypes)[] = [
    event,
    // dyePrice    
]

let commands: (CommandBuilder<any>)[] = [];

let inlines: (inlineCommandReturnTypes)[] = [];

for(const unknownCommand of commandDump){
    if(CommandBuilder.isCommandBuilder(unknownCommand)){
        if(unknownCommand.mode === "unavailable") continue;

        commands.push(unknownCommand);
    }
    else{
        if(unknownCommand.unavailable) continue;

        inlines.push(unknownCommand);
    }    
}

export default {commands, inlines};