import { CommandReturnTypes, inlineCommandReturnTypes, isCommandReturnType, isInline } from "@typings/customTypes";

const commandDump: (CommandReturnTypes | inlineCommandReturnTypes)[] = [
]

let commands: (CommandReturnTypes)[] = [];

let inlines: (inlineCommandReturnTypes)[] = [];

for(const unknownCommand of commandDump){
    if(unknownCommand.unavailable) continue;
    
    if(isInline(unknownCommand))
        inlines.push(unknownCommand);
    else if(isCommandReturnType(unknownCommand))
        commands.push(unknownCommand);
}

// mark experimentals
for(const command of commands){
    if(command.slash?.slashCommand){
        command.slash.slashCommand.setDescription(`(experimental) ${command.slash.slashCommand.description}`);
    }
}

export default {commands, inlines};