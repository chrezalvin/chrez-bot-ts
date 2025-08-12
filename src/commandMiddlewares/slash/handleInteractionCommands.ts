import { ChrezBotSlashMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { allCommands } from "@shared/commands";

export const handleInteractionCommands: ChrezBotSlashMiddleware<CustomArgs> = async (client, interaction, next) => {    
    if(!interaction.isChatInputCommand()) return;

    if(allCommands.has(interaction.commandName)){
        const commandBuilder = allCommands.get(interaction.commandName)!;

        const res = await commandBuilder.execute(interaction);

        if(ErrorValidation.isErrorValidation(res))
            next(res);
    }
    else
        next(new ErrorValidation("slash_command_unavailable", interaction.commandName));
}