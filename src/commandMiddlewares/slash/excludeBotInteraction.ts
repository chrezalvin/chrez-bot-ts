import { ChrezBotSlashMiddleware } from "@library";
import { CustomArgs } from "@typings";

export const excludeBotInteraction: ChrezBotSlashMiddleware<CustomArgs> = async (client, interaction, next) => {    
    if(interaction.user.bot) 
        return;

    next();
}