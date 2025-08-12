import { ChrezBotSlashMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";

export const interactionErrorHandler: ChrezBotSlashMiddleware<CustomArgs> = (client, interaction, next) => {
    if(interaction.error){
        if(!interaction.isChatInputCommand()) return;

        if(ErrorValidation.isErrorValidation(interaction.error))
            ErrorValidation.sendErrorValidation(interaction, interaction.error);
        else 
            interaction.reply("Unknown error occurred!");
    }
}