import { ChrezBotChatMiddleware, ErrorValidation } from "@library";
import { CustomArgs } from "@typings";

export const chatErrorHandler: ChrezBotChatMiddleware<CustomArgs> = (client, message, next) => {
    if(message.error){
        if(ErrorValidation.isErrorValidation(message.error))
            ErrorValidation.sendErrorValidation(message, message.error);
        else if(typeof message.error === "string")
            message.channel.send(`Error: ${message.error}`);
        else
            message.channel.send("An unknown error occurred.");
    }
}