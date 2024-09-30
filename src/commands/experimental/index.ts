import { inlineCommandReturnTypes, CommandBuilder } from "@library";

const commandDump: (CommandBuilder<any> | inlineCommandReturnTypes)[] = [
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