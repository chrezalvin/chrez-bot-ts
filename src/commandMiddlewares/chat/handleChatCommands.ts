import { ChrezBotChatMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { allCommands } from "@shared/commands";

export const handleChatCommands: ChrezBotChatMiddleware<CustomArgs> = async (client, message, next) => {    
    const args: string[] = message.content.split(/ +/);
    args.shift(); // remove command name (Chrez)

    // check if command available (i.e: not just Chrez tho it should be alr guarded with inline command)
    const command = args.shift();
    // change args to lowercase
    args.forEach((str, index, arr) => arr[index] = str.toLowerCase());

    if(command === undefined)
        return;

    try {
        for(const [_, commandBuilder] of allCommands) 
            if(commandBuilder.checkIfCommand(command)){
                const res = await commandBuilder.execute(message, args);
                if(ErrorValidation.isErrorValidation(res))
                    next(res);
            }
    }
    catch(e: unknown) {
        next(`An error occurred while executing the command: ${e instanceof Error ? e.message : String(e)}`);
    }

}