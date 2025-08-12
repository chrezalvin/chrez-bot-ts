import { ChrezBotSlashMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";
import { absoluteMuted } from "@shared/isAbsoluteMuted";
import { BOT_OWNER_ID } from "@config";

export const handleAbsoluteMuteInteraction: ChrezBotSlashMiddleware<CustomArgs> = (client, message, next) => {
    if(absoluteMuted){
        if(message.user.id === BOT_OWNER_ID)
            next();
        else
            next(new ErrorValidation("slash_command_unavailable", `because the bot is absolutely muted!.`));
    }
    else
        next();
}